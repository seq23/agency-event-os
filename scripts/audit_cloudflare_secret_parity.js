const fs = require("fs");

function fail(message) {
  console.error("audit_cloudflare_secret_parity: FAIL — " + message);
  process.exit(1);
}

function readJson(file) {
  if (!fs.existsSync(file)) fail("missing " + file);
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

const registry = readJson("deployment/env-var-registry.json");
const manifest = readJson("deployment/cloudflare-required-secrets.json");
const expected = [...new Set(registry.cloudflareSecretKeys || [])].sort();
const actual = [...new Set(manifest.requiredSecrets || [])].sort();
const missing = expected.filter((key) => !actual.includes(key));
const extra = actual.filter((key) => !expected.includes(key));
if (missing.length || extra.length) {
  fail(`manifest drift. Missing: ${missing.join(", ") || "none"}. Extra: ${extra.join(", ") || "none"}`);
}
console.log(`audit_cloudflare_secret_parity: PASS — ${actual.length} required Cloudflare secrets/vars are registered.`);
