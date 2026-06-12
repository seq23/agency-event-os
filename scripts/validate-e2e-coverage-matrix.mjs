#!/usr/bin/env node
import fs from 'node:fs';

const requiredFiles = [
  'E2E_REQUIRED_TEST_MATRIX.md',
  'KNOWN_EDGE_CASE_INVENTORY.md',
  'tests/e2e/day1-showtime-master-gauntlet.spec.ts',
  'tests/e2e/master-contract-edge-cases.spec.ts',
  'tests/e2e/provider-webhook-security.spec.ts',
  'tests/e2e/cross-event-scope-isolation.spec.ts',
  'tests/e2e/route-cta-inventory-crosswalk.spec.ts',
  'tests/e2e/mobile-critical-journeys.spec.ts',
  'tests/e2e/postdeploy-role-provider-critical.spec.ts',
  'tests/e2e/real-streamyard-livekit-media.spec.ts',
];
const failures = [];
for (const file of requiredFiles) if (!fs.existsSync(file)) failures.push(`Missing required E2E coverage file: ${file}`);
const corpus = requiredFiles.filter((file) => fs.existsSync(file)).map((file) => fs.readFileSync(file, 'utf8')).join('\n');
const anchors = [
  'Day 1 master gauntlet', 'Edge-case master lane', 'Route/CTA inventory crosswalk',
  'Invalid special guest', 'Duplicate attendee registration', 'expired', 'revoked',
  'two newly-created events', 'cross-event',
  'Unsigned LiveKit webhook', 'Invalid signature', 'Malformed signed JSON', 'repeated signed ingress_ended',
  'mobile critical journeys', 'operator emergency',
  'REAL StreamYard Custom RTMP', 'STREAMYARD_REAL_PROVIDER_SMOKE', 'STREAMYARD_OPERATOR_CONFIRMED_BROADCAST',
  'postdeploy role/provider critical', 'PLAYWRIGHT_DEPLOYED',
  'UNPROVEN', 'COMPLETE',
];
for (const anchor of anchors) if (!corpus.includes(anchor)) failures.push(`Missing E2E coverage anchor: ${anchor}`);
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
for (const script of ['validate:e2e-coverage', 'test:e2e:master-contract-edge', 'test:e2e:provider-webhook-security', 'test:e2e:scope-isolation', 'test:e2e:route-cta-inventory', 'test:e2e:mobile-critical', 'test:e2e:postdeploy-critical', 'test:e2e:real-streamyard-livekit', 'test:e2e:coverage-required']) {
  if (!packageJson.scripts?.[script]) failures.push(`Missing package script: ${script}`);
}
if (failures.length) {
  console.error('E2E COVERAGE MATRIX VALIDATION FAILED');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log('E2E COVERAGE MATRIX VALIDATION OK — required Agency master gauntlet, edge, route/CTA, webhook, scope, mobile, postdeploy, and real provider lanes are repo-owned. Live media/deploy proof still requires execution.');
