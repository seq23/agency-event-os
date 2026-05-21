const fs = require('fs');
const checks = {
  'app/production-access/crew/page.tsx': ['htmlFor="crew-password"','htmlFor="crew-event-code"','htmlFor="crew-role"','secure production vault','never displays the password'],
  'app/production-access/operator/page.tsx': ['htmlFor="operator-password"','OPERATOR_LAUNCHPAD_PASSWORD','secure production vault','never displays the password'],
  'app/production-access/special-guest/page.tsx': ['htmlFor="special-event-code"','htmlFor="special-role-code"','secure production vault','never displays speaker, sponsor, VIP, or client passwords'],
  'app/join/page.tsx': ['htmlFor="join-event-code"'],
  'app/app/events/new/page.tsx': ['action={startEventSetup}','createEventSetupDraft','htmlFor={id}','required'],
};
for (const [file, tokens] of Object.entries(checks)) {
  const s = fs.readFileSync(file, 'utf8');
  const missing = tokens.filter((token) => !s.includes(token));
  if (missing.length) throw new Error(`${file} missing front-door label/action tokens: ${missing.join(', ')}`);
}
if (!fs.existsSync('services/events/eventDraftStore.ts')) throw new Error('Create Event in Admin Workspace needs runtime/file draft persistence, not a dead form.');
console.log('validate_v7_frontdoor_labels: PASS');
