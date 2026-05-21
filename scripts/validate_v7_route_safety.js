const fs = require('fs');
function read(file) { return fs.readFileSync(file, 'utf8'); }
const requiredFiles = [
  'components/system/BrandedSetupError.tsx',
  'lib/env/safeEnv.ts',
  'app/production-access/crew/page.tsx',
  'app/production-access/special-guest/page.tsx',
  'app/production-access/setup-error/page.tsx',
  'app/production-access/operator/page.tsx',
  'app/production-access/launchpad/page.tsx',
  'app/production-access/logout/route.ts',
  'app/join/page.tsx',
  'app/app/events/new/page.tsx',
  'app/operator-packet/page.tsx',
];
const missing = requiredFiles.filter((file) => !fs.existsSync(file));
if (missing.length) throw new Error(`V7 route safety missing files: ${missing.join(', ')}`);
const crew = read('app/production-access/crew/page.tsx');
const guest = read('app/production-access/special-guest/page.tsx');
const operator = read('app/production-access/operator/page.tsx');
const launchpad = read('app/production-access/launchpad/page.tsx');
const packet = read('app/operator-packet/page.tsx');
const setup = read('components/system/BrandedSetupError.tsx');
const accessIndex = read('app/production-access/page.tsx');
const logout = read('app/production-access/logout/route.ts');
for (const [name, content] of [['crew', crew], ['operator', operator], ['special guest', guest]]) {
  if (!content.includes('BrandedSetupError')) throw new Error(`${name} gate must render BrandedSetupError for missing config.`);
  if (!content.includes('missingAccessEnv')) throw new Error(`${name} gate must use safe missingAccessEnv guard.`);
  if (!content.includes('export const dynamic = "force-dynamic"')) throw new Error(`${name} gate must be force-dynamic so Cloudflare runtime env is read at request time.`);
}
for (const [name, content] of [['launchpad', launchpad], ['operator packet', packet]]) {
  if (!content.includes('readV5AccessCookie') || !content.includes('payload.kind === "operator"')) throw new Error(`${name} must require a valid operator access cookie.`);
  if (!content.includes('redirect("/production-access/operator')) throw new Error(`${name} must redirect unauthenticated users to the operator gate.`);
  if (!content.includes('BrandedSetupError')) throw new Error(`${name} must fail safely when access config is missing.`);
  if (!content.includes('export const dynamic = "force-dynamic"')) throw new Error(`${name} must be force-dynamic.`);
}
if (accessIndex.includes('href="/production-access/launchpad"')) throw new Error('Production access page must not link directly to launchpad and bypass the gate.');
if (!accessIndex.includes('href="/production-access/operator"')) throw new Error('Production access page must expose the separate operator gate.');
if (!logout.includes('safeAccessCookieNames') || logout.includes('getV5AccessCookieNames')) throw new Error('Logout route must use safe cookie names and never throw on missing env.');
if (!setup.includes('Missing variable') || !setup.includes('local') || !setup.includes('Cloudflare Worker environment variables')) throw new Error('Branded setup error must name missing variables and where to set them.');
console.log('validate_v7_route_safety: PASS');
