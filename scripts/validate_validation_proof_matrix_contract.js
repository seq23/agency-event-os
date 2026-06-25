const fs = require('fs');
const failures = [];
for (const file of ['docs/VALIDATION_COMPLEXITY_POLICY.md', 'docs/VALIDATION_PROOF_MATRIX.md']) {
  if (!fs.existsSync(file)) failures.push(`Missing ${file}`);
  const body = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
  for (const token of ['Static contract', 'does not prove', 'Outcome E2E']) {
    if (!body.includes(token)) failures.push(`${file} missing proof-scope phrase: ${token}`);
  }
}
if (failures.length) { console.error('VALIDATION PROOF MATRIX CONTRACT FAIL\n' + failures.map(f => `- ${f}`).join('\n')); process.exit(1); }
console.log('VALIDATION PROOF MATRIX CONTRACT PASS — documentation declares proof limits.');
