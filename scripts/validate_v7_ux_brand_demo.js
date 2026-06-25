const fs = require('fs');
function read(file) { return fs.readFileSync(file, 'utf8'); }
if (!fs.existsSync('public/brand/west-peek-productions-logo.jpg')) throw new Error('West Peek Productions logo asset missing.');
const logo = read('components/brand/WestPeekProductionsLogo.tsx');
if (!logo.includes('next/image') || logo.includes('<img')) throw new Error('Logo component must use next/image and must not reintroduce the no-img lint warning.');
const homepage = read('app/page.tsx');
if (!homepage.includes('WestPeekProductionsLogo')) throw new Error('Homepage must render West Peek Productions logo.');
if (!homepage.includes('/venue/demo/lobby')) throw new Error('Homepage tertiary CTA must target /venue/demo/lobby.');
const venueService = read('services/venue/virtualVenueService.ts');
for (const surface of ['lobby','stage','sessions','expo','networking','people','replay','help']) {
  if (!venueService.includes(`/${surface}`)) throw new Error(`Demo venue mirror missing ${surface} surface in real venue nav.`);
}
const runtime = read('lib/runtime/getRuntimeData.ts');
if (!runtime.includes('eventId === "demo" ? "event-summit"')) throw new Error('Runtime getEvent must explicitly map demo to the seeded production-real demo event.');
const eventsIndex = read('data/events/events.json');
if (!eventsIndex.includes('"slug": "demo"') || !eventsIndex.includes('"eventId": "event-summit"')) throw new Error('Demo event alias must resolve to event-summit.');
console.log('validate_v7_ux_brand_demo: PASS');
