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
    if (!re.test(body)) failures.push(`${file} missing cleanup contract marker: ${term}`);
  }
}

requireText('scripts/tier4_controlled_rtmp_broadcaster_proof.mjs', [
  'cleanupLiveKitIngress',
  'Ingress/DeleteIngress',
  'livekit_ingress_cleanup_start',
  'livekit_ingress_cleanup_result',
  'cleanupAttempted',
  'cleanupDeleted',
  'TIER4_CONTROLLED_RTMP_RETAIN_INGRESS',
  'TIER4_CONTROLLED_RTMP_RETAIN_REASON',
  'finally',
]);
requireText('services/video/livekitIngressService.ts', [
  'Ingress/ListIngress',
  'findExistingLiveKitIngress',
  'Existing StreamYard RTMP credentials are ready and were verified against LiveKit',
]);
requireText('scripts/livekit_cleanup_stale_ingress.mjs', [
  'TIER4_LIVEKIT_CLEANUP_APPROVED',
  'TIER4_LIVEKIT_CLEANUP_INGRESS_IDS',
  'ListIngress',
  'DeleteIngress',
  'livekit-ingress-cleanup-report.json',
]);
requireText('scripts/tier4_real_provider_journey_probe.mjs', [
  'daily_room_cleanup_result',
  "cleanupStatus !== 'deleted'",
  'DAILY_API_BASE_URL must start with https://',
]);
requireText('TIER4_PROVIDER_EVIDENCE_TEMPLATE.json', [
  'cleanupStatus',
  'cleanupAttempted',
  'cleanupDeleted',
]);
requireText('TIER4_LIVE_PROVIDER_OPERATIONAL_PROOF.md', [
  'LiveKit ingress cleanup',
  'cleanupStatus',
  'deleted',
]);
requireText('TIER_VALIDATION_MODEL.md', [
  'cleanup / teardown',
  'LiveKit ingress cleanup',
]);
requireText('REPO_VALIDATION_MATRIX.md', [
  'Tier 4 cleanup',
  'DeleteIngress',
]);
requireText('VALIDATOR_ADMISSION_REGISTER.md', [
  'validate:tier4-cleanup-contract',
  'tier4:cleanup-livekit-ingress',
]);
requireText('TESTING_SEQUENCE.md', [
  'tier4:cleanup-livekit-ingress',
  'TIER4_LIVEKIT_CLEANUP_APPROVED',
  'auto-deletes its LiveKit ingress',
]);

const pkg = JSON.parse(read('package.json'));
if (!pkg.scripts?.['tier4:cleanup-livekit-ingress']) failures.push('package.json missing tier4:cleanup-livekit-ingress');
if (!pkg.scripts?.['validate:tier4-cleanup-contract']) failures.push('package.json missing validate:tier4-cleanup-contract');
if (!String(pkg.scripts?.['validate:tier4-contract'] || '').includes('validate:tier4-cleanup-contract')) failures.push('validate:tier4-contract must include validate:tier4-cleanup-contract.');
if (!String(pkg.scripts?.['validate:deploy-parity'] || '').includes('validate:tier4-cleanup-contract')) failures.push('validate:deploy-parity must include validate:tier4-cleanup-contract.');

if (failures.length) {
  console.error('TIER 4 CLEANUP CONTRACT VALIDATION FAILED');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log('TIER 4 CLEANUP CONTRACT VALIDATION OK — LiveKit ingress cleanup is explicit, validated, and not narrative-only.');
