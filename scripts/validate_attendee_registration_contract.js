const fs = require('fs');
const required = [
  'types/attendeeRegistration.ts',
  'types/attendeeSession.ts',
  'services/attendees/attendeeRegistrationService.ts',
  'services/attendees/attendeeSessionService.ts',
  'services/attendees/attendeeAgendaIntentService.ts',
  'lib/actions/attendeeAgendaActions.ts',
  'lib/actions/attendeeProfileActions.ts',
  'components/venue/RegistrationAgendaPlanner.tsx',
  'components/venue/MyAgendaPanel.tsx',
  'components/venue/EditAttendeeProfilePanel.tsx',
  'db/migrations/0022_attendee_identity_and_agenda_intents.sql'
];
const failures = [];
for (const file of required) if (!fs.existsSync(file)) failures.push(`Missing ${file}`);
function read(file) { return fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : ''; }
const registration = read('lib/actions/registrationActions.ts');
for (const token of ['createAttendeeSession', 'upsertAttendeeAgendaIntent', 'company', 'title', 'plannedSessionIds']) if (!registration.includes(token)) failures.push(`registrationActions.ts missing ${token}`);
const chat = read('components/venue/LiveRoomChat.tsx');
if (chat.includes('Conference Attendee')) failures.push('LiveRoomChat still uses fake Conference Attendee identity.');
if (!chat.includes('getCurrentAttendeeIdentity')) failures.push('LiveRoomChat does not derive identity from attendee session.');
const controls = read('components/venue/AttendeeStageJoinControls.tsx');
if (controls.includes('current-attendee')) failures.push('AttendeeStageJoinControls still defaults to current-attendee.');
const networking = read('lib/actions/networkingActions.ts') + read('components/venue/SpeedNetworkingQueuePanel.tsx');
if (networking.includes('Local E2E Attendee') || networking.includes('local-e2e-attendee')) failures.push('Networking queue still uses fake attendee identity.');
if (!networking.includes('getCurrentAttendeeIdentity')) failures.push('Networking queue does not use attendee session identity.');
const help = read('lib/actions/venueRuntimeActions.ts') + read('components/venue/HelpRequestForm.tsx');
if (!help.includes('getCurrentAttendeeIdentity') || !help.includes('attendeeId')) failures.push('Help requests are not tied to attendee identity.');
const sponsor = read('lib/actions/venueRuntimeActions.ts') + read('components/venue/SponsorLeadCaptureForm.tsx');
if (!sponsor.includes('appendSponsorLeadOptIn') || !sponsor.includes('getCurrentAttendeeProfile')) failures.push('Sponsor lead capture does not require intentional attendee-profile opt-in.');
const agenda = read('components/venue/MyAgendaPanel.tsx') + read('lib/actions/attendeeAgendaActions.ts');
if (!agenda.includes('updateMyAgendaAction') || !agenda.includes('plannedSponsorBoothIds')) failures.push('My Agenda is not editable for sessions, breakouts, and sponsor booths.');
const profile = read('components/venue/EditAttendeeProfilePanel.tsx') + read('lib/actions/attendeeProfileActions.ts');
if (!profile.includes('updateAttendeeProfileAction') || !profile.includes('networkingOptIn')) failures.push('Attendee profile is not editable with networking opt-in state.');
if (failures.length) { console.error('ATTENDEE REGISTRATION CONTRACT FAIL\n' + failures.map(f => `- ${f}`).join('\n')); process.exit(1); }
console.log('ATTENDEE REGISTRATION CONTRACT PASS — static contract only; runtime cookie/form behavior requires tests.');
