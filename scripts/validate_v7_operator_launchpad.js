const fs = require('fs');
const file = 'components/production/OperatorLaunchpad.tsx';
if (!fs.existsSync(file)) throw new Error('OperatorLaunchpad component missing.');
const s = fs.readFileSync(file, 'utf8');
const required = [
  'Core Production','Create Event in Admin Workspace','Preview Demo Venue','Event Operations','Backend / testing / admin','Testing Console','Route Health','Supabase Runtime','Event Config Package','Security Smoke Tests','Post-Deploy Smoke Test','Email Resend / Logs','Video Provider Tests','Access Gate Tests','Live production controls','Role entry testing','Crew Gate','Operator Gate','Special Guest Gate','Operator Documentation','/admin/testing','/app/events/new','/venue/demo/lobby','/venue/demo/sessions','/venue/demo/expo/booth-clarity','/venue/demo/people','/operator-packet','No configured events yet','Open setup preview','Open guest venue','Open crew console'
];
const lower = s.toLowerCase();
const missing = required.filter((token) => !lower.includes(token.toLowerCase()));
if (missing.length) throw new Error(`Operator Launchpad missing required tokens: ${missing.join(', ')}`);
const route = fs.readFileSync('app/production-access/launchpad/page.tsx','utf8');
if (!route.includes('readV5AccessCookie') || !route.includes('operatorPayload?.kind === "operator"')) throw new Error('Operator Launchpad route must remain behind operator production gate.');
if (!route.includes('ownerPayload?.kind === "owner"')) throw new Error('Operator Launchpad route must accept owner master cookie as universal authority.');
console.log('validate_v7_operator_launchpad: PASS');
