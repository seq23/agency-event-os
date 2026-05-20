const fs = require("fs");
const path = require("path");
function fail(message) { console.error("validate_required_env_registry: FAIL — " + message); process.exit(1); }
function read(file) { if (!fs.existsSync(file)) fail("missing " + file); return fs.readFileSync(file, "utf8"); }
function readJson(file) { return JSON.parse(read(file)); }
function walk(dir) {
  const out = [];
  function visit(current) {
    if (!fs.existsSync(current)) return;
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      if (["node_modules", ".git", ".next", ".open-next", ".wrangler", "coverage"].includes(entry.name)) continue;
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) visit(full);
      else out.push(full);
    }
  }
  visit(dir);
  return out;
}
function accessKeys() {
  const access = readJson("data/access/event-access-config.json");
  const keys = new Set();
  for (const eventConfig of Object.values(access.events || {})) {
    if (eventConfig.crewPasswordEnvKey) keys.add(eventConfig.crewPasswordEnvKey);
    for (const item of eventConfig.specialGuestCodes || []) if (item.envKey) keys.add(item.envKey);
  }
  return keys;
}

const registry = readJson("deployment/env-var-registry.json");
const manifest = readJson("deployment/cloudflare-required-secrets.json");
const envExample = read(".env.example");
const registered = new Set([...(registry.requiredProductionEnv || []), ...(registry.cloudflareSecretKeys || []), ...(registry.localOnlyEnv || []), ...(registry.internalRuntimeEnv || []), ...(registry.optionalDevEnv || [])]);
const envNames = new Set();
for (const file of walk(".")) {
  if (!/\.(ts|tsx|js|jsx)$/.test(file)) continue;
  const rel = file.replace(/^\.\//, "");
  if (rel.startsWith("scripts/validate_required_env_registry") || rel.startsWith("scripts/sync_required_secrets_manifest")) continue;
  const text = fs.readFileSync(file, "utf8");
  for (const match of text.matchAll(/process\.env\.([A-Z0-9_]+)/g)) envNames.add(match[1]);
  for (const match of text.matchAll(/process\.env\[["'`]([A-Z0-9_]+)["'`]\]/g)) envNames.add(match[1]);
}
for (const key of envNames) {
  if (!registered.has(key)) fail(`process.env.${key} is used but not classified in deployment/env-var-registry.json`);
}
for (const key of accessKeys()) {
  if (!(registry.requiredProductionEnv || []).includes(key)) fail(`${key} from event-access-config missing from requiredProductionEnv`);
  if (!(registry.cloudflareSecretKeys || []).includes(key)) fail(`${key} from event-access-config missing from cloudflareSecretKeys`);
}
const expectedManifest = [...new Set(registry.cloudflareSecretKeys || [])].sort();
const actualManifest = [...new Set(manifest.requiredSecrets || [])].sort();
if (JSON.stringify(expectedManifest) !== JSON.stringify(actualManifest)) {
  const missing = expectedManifest.filter((key) => !actualManifest.includes(key));
  const extra = actualManifest.filter((key) => !expectedManifest.includes(key));
  fail(`cloudflare-required-secrets.json drift. Run npm run sync:required-secrets. Missing: ${missing.join(", ") || "none"}. Extra: ${extra.join(", ") || "none"}`);
}
for (const key of registry.requiredProductionEnv || []) {
  if (!envExample.match(new RegExp(`^${key}=`, "m"))) fail(`${key} missing from .env.example`);
}
if (envExample.match(/^VIDEO_PROVIDER=mock$/m)) fail(".env.example must not set VIDEO_PROVIDER=mock");
console.log("validate_required_env_registry: PASS");
