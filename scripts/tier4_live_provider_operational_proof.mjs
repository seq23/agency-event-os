#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const reportsDir = path.join(root, 'reports', 'tier4');
fs.mkdirSync(reportsDir, { recursive: true });

const redactionPatterns = [
  /LIVEKIT_API_SECRET/i,
  /LIVEKIT_WEBHOOK_SECRET/i,
  /SUPABASE_SERVICE_ROLE_KEY/i,
  /RESEND_API_KEY/i,
  /DAILY_API_KEY/i,
  /ZOOM_MEETING_SDK_SECRET/i,
  /V5_ACCESS_COOKIE_SECRET/i,
  /Bearer\s+(?!tokens?\b)[A-Za-z0-9._-]{16,}/i,
  /(?:streamKey|stream_key)\s*["':=]+\s*["'][^"']{8,}/i,
  /rtmp:\/\//i,
  /rtmps:\/\//i,
  /eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+/
];

function baseUrl() {
  return process.env.POSTDEPLOY_BASE_URL || process.env.SMOKE_BASE_URL || process.env.PLAYWRIGHT_BASE_URL || process.env.NEXT_PUBLIC_APP_URL || '';
}

function isNonLocalUrl(value) {
  return /^https?:\/\//.test(value) && !/localhost|127\.0\.0\.1|0\.0\.0\.0/i.test(value);
}

function envStatus(key) {
  const value = process.env[key] || '';
  return {
    key,
    present: Boolean(value),
    length: value.length,
    sha12: value ? crypto.createHash('sha256').update(value).digest('hex').slice(0, 12) : ''
  };
}

function requireAll(keys, failures, lane) {
  for (const key of keys) {
    if (!process.env[key]) failures.push(`${lane}: missing required env ${key}`);
  }
}

function optionalLaneEnabled(keys) {
  return keys.some((key) => Boolean(process.env[key]));
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function inspectEvidence(file, failures) {
  if (!file) {
    failures.push('StreamYard/LiveKit: missing TIER4_STREAMYARD_LIVE_EVIDENCE_PATH.');
    return null;
  }
  const absolute = path.isAbsolute(file) ? file : path.join(root, file);
  if (!fs.existsSync(absolute)) {
    failures.push(`StreamYard/LiveKit: evidence file does not exist: ${file}`);
    return null;
  }
  const raw = fs.readFileSync(absolute, 'utf8');
  for (const pattern of redactionPatterns) {
    if (pattern.test(raw)) failures.push(`StreamYard/LiveKit: evidence file appears to contain forbidden secret/provider material matching ${pattern}.`);
  }
  let evidence;
  try {
    evidence = JSON.parse(raw);
  } catch (error) {
    failures.push(`StreamYard/LiveKit: evidence file is not valid JSON: ${error.message}`);
    return null;
  }
  const required = [
    'providerLane',
    'deployedBaseUrl',
    'eventId',
    'stageId',
    'operatorConfirmedBroadcast',
    'streamyardBroadcastStartedAt',
    'livekitIngressIdRedacted',
    'appReportedStates',
    'secretsExposed',
    'cleanupStatus',
    'deploymentIdentity',
    'livekitProviderApi',
    'supabaseProductionPersistence',
    'roleBoundaryProof'
  ];
  for (const key of required) {
    if (evidence[key] === undefined || evidence[key] === null || evidence[key] === '') failures.push(`StreamYard/LiveKit: evidence missing ${key}.`);
  }
  if (evidence.providerLane !== 'streamyard-livekit') failures.push('StreamYard/LiveKit: evidence providerLane must equal streamyard-livekit.');
  if (evidence.operatorConfirmedBroadcast !== true) failures.push('StreamYard/LiveKit: operatorConfirmedBroadcast must be true.');
  if (evidence.secretsExposed !== false) failures.push('StreamYard/LiveKit: secretsExposed must be false.');
  if (!Array.isArray(evidence.appReportedStates) || !evidence.appReportedStates.some((state) => /LIVEKIT_INGRESS_LIVE|READY_FOR_STREAMYARD|SWITCHING_TO_DAILY/.test(String(state)))) {
    failures.push('StreamYard/LiveKit: evidence appReportedStates must include provider state such as READY_FOR_STREAMYARD, LIVEKIT_INGRESS_LIVE, or SWITCHING_TO_DAILY.');
  }
  if (isNonLocalUrl(baseUrl()) && evidence.deployedBaseUrl && evidence.deployedBaseUrl !== baseUrl()) {
    failures.push(`StreamYard/LiveKit: evidence deployedBaseUrl (${evidence.deployedBaseUrl}) does not match command base URL (${baseUrl()}).`);
  }

  const deployment = evidence.deploymentIdentity || {};
  if (deployment.deployedRuntimeVerified !== true) failures.push('StreamYard/LiveKit: deploymentIdentity.deployedRuntimeVerified must be true.');
  const livekitProof = evidence.livekitProviderApi || {};
  if (livekitProof.ingressCreatedOrObserved !== true) failures.push('StreamYard/LiveKit: livekitProviderApi.ingressCreatedOrObserved must be true.');
  if (livekitProof.providerRoomObserved !== true) failures.push('StreamYard/LiveKit: livekitProviderApi.providerRoomObserved must be true.');
  if (livekitProof.mediaConnectionObserved !== true) failures.push('StreamYard/LiveKit: livekitProviderApi.mediaConnectionObserved must be true.');
  const supabaseProof = evidence.supabaseProductionPersistence || {};
  if (supabaseProof.writeReadbackVerified !== true) failures.push('StreamYard/LiveKit: supabaseProductionPersistence.writeReadbackVerified must be true.');
  if (supabaseProof.noDemoFallback !== true) failures.push('StreamYard/LiveKit: supabaseProductionPersistence.noDemoFallback must be true.');
  const roleProof = evidence.roleBoundaryProof || {};
  if (roleProof.privateProviderControlsDeniedToPublic !== true) failures.push('StreamYard/LiveKit: roleBoundaryProof.privateProviderControlsDeniedToPublic must be true.');
  if (roleProof.eventScopedAccessVerified !== true) failures.push('StreamYard/LiveKit: roleBoundaryProof.eventScopedAccessVerified must be true.');
  for (const laneName of ['dailyFallback', 'zoomEscalation', 'resendEmail']) {
    const lane = evidence[laneName];
    if (lane && lane.configured === true && lane.proofPassed !== true) failures.push(`StreamYard/LiveKit: ${laneName}.proofPassed must be true when configured.`);
  }
  return { ...evidence, evidencePath: path.relative(root, absolute) };
}

function run(command, name, env = {}) {
  const logFile = path.join(reportsDir, `${name.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.log`);
  const proc = spawnSync(command, {
    cwd: root,
    shell: true,
    encoding: 'utf8',
    env: { ...process.env, ...env, NODE_OPTIONS: process.env.NODE_OPTIONS || '--max-old-space-size=3072' }
  });
  const output = [`$ ${command}`, proc.stdout || '', proc.stderr || ''].join('\n');
  fs.writeFileSync(logFile, output);
  return { name, command, status: proc.status === 0 ? 'PASS' : proc.status === 2 ? 'BLOCKED' : 'FAIL', exitCode: proc.status, logFile: path.relative(root, logFile) };
}

const failures = [];
const warnings = [];
const lanes = [];
const deployedBaseUrl = baseUrl();

if (process.env.TIER4_LIVE_PROVIDER_OPERATIONAL_PROOF !== '1') failures.push('Tier 4 requires TIER4_LIVE_PROVIDER_OPERATIONAL_PROOF=1.');
if (!isNonLocalUrl(deployedBaseUrl)) failures.push('Tier 4 requires explicit non-local deployed URL via POSTDEPLOY_BASE_URL, SMOKE_BASE_URL, PLAYWRIGHT_BASE_URL, or NEXT_PUBLIC_APP_URL.');

requireAll(['STREAMYARD_REAL_PROVIDER_SMOKE', 'STREAMYARD_OPERATOR_CONFIRMED_BROADCAST'], failures, 'StreamYard/LiveKit');
if (process.env.STREAMYARD_REAL_PROVIDER_SMOKE && process.env.STREAMYARD_REAL_PROVIDER_SMOKE !== '1') failures.push('StreamYard/LiveKit: STREAMYARD_REAL_PROVIDER_SMOKE must be 1.');
if (process.env.STREAMYARD_OPERATOR_CONFIRMED_BROADCAST && process.env.STREAMYARD_OPERATOR_CONFIRMED_BROADCAST !== '1') failures.push('StreamYard/LiveKit: STREAMYARD_OPERATOR_CONFIRMED_BROADCAST must be 1.');
requireAll(['LIVEKIT_URL', 'LIVEKIT_API_KEY', 'LIVEKIT_API_SECRET', 'LIVEKIT_WEBHOOK_SECRET'], failures, 'LiveKit');
requireAll(['V5_ACCESS_COOKIE_SECRET'], failures, 'Tier 4 role-boundary proof');

const evidence = inspectEvidence(process.env.TIER4_STREAMYARD_LIVE_EVIDENCE_PATH, failures);
const tier4EventId = evidence?.eventId || process.env.TIER4_EVENT_ID || process.env.STREAMYARD_E2E_EVENT_ID || '';
const tier4StageId = evidence?.stageId || process.env.TIER4_STAGE_ID || process.env.STREAMYARD_E2E_STAGE_ID || 'main-stage';
const tier4EventEnv = {
  TIER4_EVENT_ID: tier4EventId,
  STREAMYARD_E2E_EVENT_ID: tier4EventId,
  TIER4_STAGE_ID: tier4StageId,
  STREAMYARD_E2E_STAGE_ID: tier4StageId
};

requireAll(['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY', 'SUPABASE_SERVICE_ROLE_KEY'], failures, 'Supabase production persistence');

const dailyEnabled = optionalLaneEnabled(['DAILY_API_KEY', 'DAILY_DOMAIN', 'DAILY_API_BASE_URL', 'DAILY_FALLBACK_ENABLED']);
if (dailyEnabled) requireAll(['DAILY_API_KEY', 'DAILY_DOMAIN'], failures, 'Daily fallback');
else warnings.push('Daily fallback Tier 4 lane not configured; must be explicitly accepted as not applicable before COMPLETE if Daily is a production provider.');

const zoomEnabled = optionalLaneEnabled(['ZOOM_MEETING_SDK_KEY', 'ZOOM_MEETING_SDK_SECRET']);
if (zoomEnabled) requireAll(['ZOOM_MEETING_SDK_KEY', 'ZOOM_MEETING_SDK_SECRET'], failures, 'Zoom fallback');
else warnings.push('Zoom Tier 4 lane not configured; must be explicitly accepted as not applicable before COMPLETE if Zoom is a production fallback.');

const resendEnabled = optionalLaneEnabled(['RESEND_API_KEY', 'EMAIL_FROM', 'EMAIL_REPLY_TO', 'TIER4_EMAIL_TEST_TO']);
if (resendEnabled) requireAll(['RESEND_API_KEY', 'EMAIL_FROM', 'TIER4_EMAIL_TEST_TO'], failures, 'Resend transactional email');
else warnings.push('Resend Tier 4 lane not configured; must be explicitly accepted as not applicable before COMPLETE if transactional email is production-critical.');

const envKeys = [
  'POSTDEPLOY_BASE_URL', 'SMOKE_BASE_URL', 'PLAYWRIGHT_BASE_URL', 'NEXT_PUBLIC_APP_URL',
  'TIER4_LIVE_PROVIDER_OPERATIONAL_PROOF', 'STREAMYARD_REAL_PROVIDER_SMOKE', 'STREAMYARD_OPERATOR_CONFIRMED_BROADCAST',
  'LIVEKIT_URL', 'LIVEKIT_API_KEY', 'LIVEKIT_API_SECRET', 'LIVEKIT_WEBHOOK_SECRET', 'LIVEKIT_INGRESS_RTMP_BASE_URL', 'V5_ACCESS_COOKIE_SECRET',
  'NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY', 'SUPABASE_SERVICE_ROLE_KEY',
  'DAILY_API_KEY', 'DAILY_DOMAIN', 'DAILY_API_BASE_URL', 'DAILY_FALLBACK_ENABLED',
  'ZOOM_MEETING_SDK_KEY', 'ZOOM_MEETING_SDK_SECRET',
  'RESEND_API_KEY', 'EMAIL_FROM', 'EMAIL_REPLY_TO', 'TIER4_EMAIL_TEST_TO'
];

if (!failures.length) {
  const deployedEnv = { POSTDEPLOY_BASE_URL: deployedBaseUrl, SMOKE_BASE_URL: deployedBaseUrl, PLAYWRIGHT_BASE_URL: deployedBaseUrl, ...tier4EventEnv };
  lanes.push(run('npm run postdeploy:full', 'tier4-prereq-postdeploy-full', deployedEnv));
  lanes.push(run('npm run tier4:real-provider-journey-probe', 'tier4-real-provider-journey-probe', deployedEnv));
  lanes.push(run('npm run smoke:streamyard-livekit:real', 'tier4-streamyard-livekit-smoke', deployedEnv));
  lanes.push(run('npm run test:e2e:tier4-real-streamyard-livekit', 'tier4-real-streamyard-livekit-e2e', deployedEnv));
  lanes.push(run('npm run test:e2e:tier4-real-provider-journeys', 'tier4-real-provider-journeys-e2e', deployedEnv));
  for (const lane of lanes) {
    if (lane.status !== 'PASS') failures.push(`${lane.name}: ${lane.status} exit=${lane.exitCode}; see ${lane.logFile}`);
  }
} else {
  lanes.push({ name: 'tier4-prereq-postdeploy-full', status: 'BLOCKED', reason: 'Prerequisites failed before command execution.' });
  lanes.push({ name: 'tier4-real-provider-journey-probe', status: 'BLOCKED', reason: 'Prerequisites failed before command execution.' });
  lanes.push({ name: 'tier4-streamyard-livekit-smoke', status: 'BLOCKED', reason: 'Prerequisites failed before command execution.' });
  lanes.push({ name: 'tier4-real-streamyard-livekit-e2e', status: 'BLOCKED', reason: 'Prerequisites failed before command execution.' });
  lanes.push({ name: 'tier4-real-provider-journeys-e2e', status: 'BLOCKED', reason: 'Prerequisites failed before command execution.' });
}

const report = {
  repo: 'agency-event-os',
  generatedAt: new Date().toISOString(),
  tier: 4,
  deployedBaseUrl,
  result: failures.length ? 'BLOCKED_OR_FAIL' : 'PASS',
  statusLabel: failures.length ? 'BLOCKED — TIER 4 LIVE PROVIDER EVIDENCE REQUIRED' : 'TIER 4 PASSED — REAL LIVE PROVIDER OPERATIONAL PROOF',
  envStatus: envKeys.map(envStatus),
  evidence,
  lanes,
  warnings,
  failures
};

fs.writeFileSync(path.join(reportsDir, 'tier4-provider-proof-report.json'), JSON.stringify(report, null, 2) + '\n');
const md = [];
md.push('# Tier 4 Provider Proof Report');
md.push('');
md.push(`Repo: ${report.repo}`);
md.push(`Generated: ${report.generatedAt}`);
md.push(`Base URL: ${report.deployedBaseUrl || 'MISSING'}`);
md.push(`Result: ${report.statusLabel}`);
md.push('');
md.push('## Lanes');
for (const lane of lanes) md.push(`- ${lane.name}: ${lane.status}${lane.logFile ? ` (${lane.logFile})` : ''}${lane.reason ? ` — ${lane.reason}` : ''}`);
md.push('');
md.push('## Evidence');
md.push(evidence ? `- StreamYard/LiveKit evidence: ${evidence.evidencePath}` : '- StreamYard/LiveKit evidence: MISSING/INVALID');
md.push('');
md.push('## Warnings');
md.push(warnings.length ? warnings.map((warning) => `- ${warning}`).join('\n') : 'None.');
md.push('');
md.push('## Failures');
md.push(failures.length ? failures.map((failure) => `- ${failure}`).join('\n') : 'None.');
fs.writeFileSync(path.join(reportsDir, 'tier4-provider-proof-report.md'), md.join('\n') + '\n');

console.log(md.join('\n'));
process.exit(failures.length ? 2 : 0);
