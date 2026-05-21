const fs = require('fs');
const file = 'docs/AGENCY_EVENT_OS_DAY1_OPERATOR_PACKET.md';
if (!fs.existsSync(file)) throw new Error('Day 1 operator packet missing.');
const s = fs.readFileSync(file, 'utf8');
const required = ['LiveKit','Daily','Zoom','Google Meet','CrewAccess-2026!','OperatorLaunchpad-2026!','SpeakerGuest-2026!','SponsorGuest-2026!','VIPGuest-2026!','Operator Launchpad','Production Gate','Preview Demo Venue','Create Event in Admin Workspace','Testing Console','run-of-show spine','Setup spine','Access spine','Venue spine','Fallback spine','Communications spine'];
const missing = required.filter((token) => !s.toLowerCase().includes(token.toLowerCase()));
if (missing.length) throw new Error(`Day 1 packet missing: ${missing.join(', ')}`);
console.log('validate_v7_day1_packet: PASS');
