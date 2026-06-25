const fs = require('fs');
const file = 'data/testing/cta-promise-registry.json';
const failures = [];
if (!fs.existsSync(file)) failures.push('Missing CTA promise registry.');
let registry = { ctas: [] };
try { registry = JSON.parse(fs.readFileSync(file, 'utf8')); } catch (error) { failures.push(`Invalid CTA registry JSON: ${error.message}`); }
if (!Array.isArray(registry.ctas) || registry.ctas.length < 5) failures.push('CTA registry must define at least five critical CTA promises.');
for (const cta of registry.ctas || []) {
  if (!cta.sourceRoute || !cta.ctaText || !cta.href || !cta.intendedPersona || !cta.expectedOutcome) failures.push(`Incomplete CTA registry row: ${JSON.stringify(cta)}`);
  const publicRoute = String(cta.sourceRoute).startsWith('/') && !String(cta.sourceRoute).startsWith('/production-access') && !String(cta.sourceRoute).startsWith('/admin');
  const protectedTarget = String(cta.href).startsWith('/app') || String(cta.href).startsWith('/admin');
  if (publicRoute && protectedTarget && !cta.requiresAuthDisclosure) failures.push(`Public CTA ${cta.ctaText} routes to protected target without auth disclosure.`);
}
if (failures.length) { console.error('CTA PROMISE REGISTRY CONTRACT FAIL\n' + failures.map(f => `- ${f}`).join('\n')); process.exit(1); }
console.log('CTA PROMISE REGISTRY CONTRACT PASS — static registry only; browser outcome requires E2E.');
