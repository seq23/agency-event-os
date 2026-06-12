#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const failures = [];
function read(file) {
  const p = path.join(root, file);
  if (!fs.existsSync(p)) { failures.push(`Missing ${file}`); return ''; }
  return fs.readFileSync(p, 'utf8');
}
function requireText(file, terms) {
  const body = read(file);
  for (const term of terms) {
    const re = term instanceof RegExp ? term : new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    if (!re.test(body)) failures.push(`${file} missing Tier 4 provider ladder marker: ${term}`);
  }
}

requireText('scripts/tier4_real_provider_journey_probe.mjs', [
  'LiveKit real ingress via deployed app',
  'cleanupLiveKitIngress',
  'Ingress/DeleteIngress',
  'daily_room_create_start',
  'daily_room_cleanup_result',
  'zoom_unauth_signature_start',
  'zoom_auth_signature_result',
  'google_meet_url_check_result',
  'Cloudflare Stream Live fallback provider',
  'cloudflare_stream_live_input_create_start',
  'cloudflare_stream_live_input_cleanup_result',
  'TIER4_CLOUDFLARE_STREAM_CONTROLLED_BROADCASTER',
  'Daily real fallback provider',
  'cleanupStatus !== \'deleted\'',
  'Zoom authorized manual escalation',
  'not_required_stateless_signature',
  'Google Meet manual fallback continuity',
  'GOOGLE_MEET_MANAGED_FALLBACK_URL',
  'GOOGLE_MEET_EMERGENCY_URL',
  'TIER4_GOOGLE_MEET_NOT_APPLICABLE_REASON',
  'provider_lane_result',
  'exerciseEveryConfiguredRung',
  'DAILY_API_BASE_URL must start with https://',
]);
requireText('scripts/tier4_controlled_rtmp_broadcaster_proof.mjs', [
  'providerLadderEventId',
  'TIER4_PROVIDER_LADDER_EVENT_ID',
  'cloudflareStreamFallback',
  'dailyFallback',
  'zoomEscalation',
  'googleMeetFallback',
  'livekitOnlyMode',
  'cleanupStatus',
  'controlledLiveKitProofPassed',
  '[REDACTED_STREAM_KEY]',
  'sanitizeProofPayload',
]);
requireText('scripts/tier4_live_provider_operational_proof.mjs', [
  'googleMeetFallback',
  'REDACTED_STREAM_KEY',
  'sanitizeOutput',
  'logExcerpt',
  'collectFailureDetails',
  'failureDetails',
  'controlledEvidenceCoversStreamYard',
  'TIER4_REQUIRE_LEGACY_STREAMYARD_E2E',
  'controlled_rtmp_attendee_evidence',
  'livekitOnlyMode.cleanupStatus must be deleted',
  'dailyFallback.cleanupStatus must be deleted',
  'zoomEscalation.cleanupStatus must be not_required_stateless_signature',
  'googleMeetFallback.cleanupStatus must be not_required_manual_static_link',
]);
requireText('scripts/streamyard_livekit_real_provider_smoke.sh', [
  'REDACTED_STREAM_KEY',
  'TIER4_EVENT_ID',
  'STREAMYARD_E2E_EVENT_ID',
]);
requireText('tests/e2e/streamyard-producer-ingress.spec.ts', ['process.env.TIER4_EVENT_ID', 'process.env.STREAMYARD_E2E_EVENT_ID']);
requireText('tests/e2e/real-streamyard-livekit-media.spec.ts', ['process.env.TIER4_EVENT_ID', 'process.env.STREAMYARD_E2E_EVENT_ID']);
requireText('TIER4_PROVIDER_EVIDENCE_TEMPLATE.json', [
  'cloudflareStreamFallback',
  'dailyFallback', 'zoomEscalation', 'googleMeetFallback', 'livekitOnlyMode', 'cleanupStatus'
]);
requireText('REPO_VALIDATION_MATRIX.md', ['Cloudflare Stream', 'Daily fallback', 'Zoom', 'Google Meet', 'cleanup']);
requireText('TIER_VALIDATION_MODEL.md', ['Cloudflare Stream', 'Daily', 'Zoom', 'Google Meet', 'cleanup']);
requireText('TESTING_SEQUENCE.md', ['Cloudflare Stream', 'Daily', 'Zoom', 'Google Meet', 'tier4:auto-controlled-livekit-proof']);
requireText('VALIDATOR_ADMISSION_REGISTER.md', ['validate:tier4-provider-ladder-contract']);
requireText('TIER4_E2E_DATA_TRACE_FINAL_REVIEW_2026-06-12.md', ['LiveKit Twirp URL normalization', 'Cloudflare Stream Live fallback', 'Daily fallback resource cleanup', 'Zoom fallback authorization', 'Google Meet manual continuity fallback', 'Controlled RTMP harness vs provider ladder event collision']);

const pkg = JSON.parse(read('package.json'));
if (!pkg.scripts?.['validate:tier4-provider-ladder-contract']) failures.push('package.json missing validate:tier4-provider-ladder-contract');
if (!String(pkg.scripts?.['validate:tier4-contract'] || '').includes('validate:tier4-provider-ladder-contract')) failures.push('validate:tier4-contract must include validate:tier4-provider-ladder-contract.');
if (!String(pkg.scripts?.['validate:deploy-parity'] || '').includes('validate:tier4-provider-ladder-contract')) failures.push('validate:deploy-parity must include validate:tier4-provider-ladder-contract.');

if (failures.length) {
  console.error('TIER 4 PROVIDER LADDER CONTRACT VALIDATION FAILED');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log('TIER 4 PROVIDER LADDER CONTRACT VALIDATION OK — LiveKit, Cloudflare Stream, Daily, Zoom, and Google Meet lanes are explicit and cleanup semantics are enforced.');
