const fs = require('fs');

function fail(message) {
  console.error(`validate_role_journey_e2e_contract: FAIL — ${message}`);
  process.exit(1);
}

function read(file) {
  if (!fs.existsSync(file)) fail(`missing ${file}`);
  return fs.readFileSync(file, 'utf8');
}

const requiredFiles = [
  'docs/ROLE_JOURNEY_E2E_MATRIX.md',
  'docs/TRANSACTIONAL_FULL_BUFFETT_E2E_MATRIX.md',
  'tests/e2e/helpers/roleJourney.ts',
  'tests/e2e/visitor-full-journey.spec.ts',
  'tests/e2e/attendee-full-journey.spec.ts',
  'tests/e2e/role-surfaces-full-journey.spec.ts',
  'tests/e2e/producer-admin-full-journey.spec.ts',
  'tests/e2e/crew-testing-console-full-journey.spec.ts',
  'tests/e2e/access-safe-failure-full-journey.spec.ts',
  'tests/e2e/transactional-full-buffett.spec.ts',
  'tests/e2e/helpers/runtimeTrace.ts',
  'components/testing/TestingConsole.tsx',
  'components/testing/ShowtimeReadinessPanel.tsx',
  'components/testing/BrowserDiagnosticsPanel.tsx',
];

for (const file of requiredFiles) read(file);

const matrix = read('docs/ROLE_JOURNEY_E2E_MATRIX.md').toLowerCase();
for (const role of ['visitor', 'attendee', 'speaker', 'sponsor', 'crew', 'client', 'producer', 'admin']) {
  if (!matrix.includes(role)) fail(`ROLE_JOURNEY_E2E_MATRIX.md missing ${role}`);
}
for (const concept of ['livestream', 'livekit', 'matchmaking', 'networking', 'run of show', 'fallback', 'zoom', 'google meet']) {
  if (!matrix.includes(concept)) fail(`ROLE_JOURNEY_E2E_MATRIX.md missing ${concept}`);
}
if (!matrix.includes('go/no-go') && !matrix.includes('go / no-go') && !matrix.includes('go-no-go')) fail('ROLE_JOURNEY_E2E_MATRIX.md missing go/no-go');

const helper = read('tests/e2e/helpers/roleJourney.ts');
for (const token of ['expectVisibleRoute', 'expectRouteMatrix', 'expectLinksStayFirstParty', 'pageerror', 'console']) {
  if (!helper.includes(token)) fail(`roleJourney helper missing ${token}`);
}

const allTests = requiredFiles.filter((file) => file.startsWith('tests/e2e/') && file.endsWith('.ts')).map(read).join('\n').toLowerCase();
for (const route of [
  '/venue/demo/stage',
  '/venue/demo/run-of-show',
  '/venue/demo/networking',
  '/admin/testing/demo',
  '/app/events/demo/video-health',
  '/speaker/events/demo/tech-check',
  '/sponsor/events/demo/leads',
  '/crew/events/demo/call-sheet',
  '/client/nova-capital/events/demo/reports',
]) {
  if (!allTests.includes(route)) fail(`full journey tests missing ${route}`);
}
for (const term of ['showtime-readiness-barometer', 'fallback-decision-helper', 'major-system-health-grid']) {
  if (!allTests.includes(term)) fail(`crew testing console E2E missing ${term}`);
}

const testingConsole = read('components/testing/TestingConsole.tsx');
for (const panel of ['ShowtimeReadinessPanel', 'BrowserDiagnosticsPanel', 'RouteHealthPanel', 'VideoProvidersPanel', 'RunOfShowPanel', 'AttendeeExperiencePanel']) {
  if (!testingConsole.includes(panel)) fail(`TestingConsole missing ${panel}`);
}

const showtime = read('components/testing/ShowtimeReadinessPanel.tsx').toLowerCase();
for (const term of ['showtime readiness', 'go/no-go', 'livestream', 'livekit', 'daily', 'zoom', 'google meet', 'matchmaking', 'run of show', 'fallback decision helper']) {
  if (!showtime.includes(term)) fail(`ShowtimeReadinessPanel missing ${term}`);
}

const browserDiagnostics = read('components/testing/BrowserDiagnosticsPanel.tsx').toLowerCase();
for (const term of ['camera', 'microphone', 'speaker', 'network', 'producer summary']) {
  if (!browserDiagnostics.includes(term)) fail(`BrowserDiagnosticsPanel missing ${term}`);
}

const pkg = JSON.parse(read('package.json'));
if (!pkg.scripts['gauntlet:playwright:local']) fail('package.json missing gauntlet:playwright:local');
if (!pkg.scripts['test:e2e:local-headed']) fail('package.json missing test:e2e:local-headed');
if (!pkg.scripts['validate:role-journey-e2e']) fail('package.json missing validate:role-journey-e2e');
if (!pkg.scripts['test:e2e:transactional']) fail('package.json missing test:e2e:transactional');
if (!pkg.scripts['validate:transactional-e2e-contract']) fail('package.json missing validate:transactional-e2e-contract');
if (!pkg.scripts['validate:deploy-parity'].includes('validate_role_journey_e2e_contract.js')) fail('validate:deploy-parity must include validate_role_journey_e2e_contract.js');

console.log('validate_role_journey_e2e_contract: PASS');
