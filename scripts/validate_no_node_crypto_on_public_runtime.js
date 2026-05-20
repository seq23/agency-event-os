const fs = require("fs");
const path = require("path");
const roots = ["app", "components", "lib/actions", "services/access", "services/analytics", "services/venue"];
const failures = [];
function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.(ts|tsx)$/.test(full)) {
      const text = fs.readFileSync(full, "utf8");
      if (text.includes('from "crypto"') || text.includes("from 'crypto'") || text.includes('from "node:crypto"') || text.includes("from 'node:crypto'")) failures.push(full);
    }
  }
}
for (const root of roots) walk(root);
if (failures.length) { console.error("validate_no_node_crypto_on_public_runtime: FAIL"); for (const f of failures) console.error("- " + f); process.exit(1); }
console.log("validate_no_node_crypto_on_public_runtime: PASS");
