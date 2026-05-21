const fs = require("fs");
function fail(message) { console.error("validate_production_config_hard_fail: FAIL — " + message); process.exit(1); }
function readJson(file) { if (!fs.existsSync(file)) fail("missing " + file); return JSON.parse(fs.readFileSync(file, "utf8")); }
const registry = readJson("deployment/env-var-registry.json");
const required = registry.requiredProductionEnv || [];
const missing = [];
const placeholders = [];
for (const key of required) {
  const value = process.env[key];
  if (!value) missing.push(key);
  else if (/^(changeme|change-me|placeholder|example|todo|mock)$/i.test(value.trim())) placeholders.push(key);
}
if (missing.length || placeholders.length) {
  console.error("validate_production_config_hard_fail: FAIL");
  if (missing.length) { console.error("Missing required production env values:"); for (const key of missing) console.error("- " + key); }
  if (placeholders.length) { console.error("Placeholder/mock production env values:"); for (const key of placeholders) console.error("- " + key); }
  process.exit(1);
}
if (process.env.CREW_ACCESS_PASSWORD && process.env.OPERATOR_LAUNCHPAD_PASSWORD && process.env.CREW_ACCESS_PASSWORD === process.env.OPERATOR_LAUNCHPAD_PASSWORD) fail("CREW_ACCESS_PASSWORD and OPERATOR_LAUNCHPAD_PASSWORD must be different");
if (process.env.VIDEO_PROVIDER === "mock") fail("VIDEO_PROVIDER=mock is forbidden for production/deploy validation");
if (process.env.ALLOW_MOCK_VIDEO_PROVIDER_IN_PRODUCTION === "true") fail("ALLOW_MOCK_VIDEO_PROVIDER_IN_PRODUCTION=true is forbidden for production deploy validation");
if (process.env.DAILY_FALLBACK_ENABLED !== "true") fail("DAILY_FALLBACK_ENABLED must be true for the production fallback contract");
if (process.env.AGENCY_EVENT_OS_RUNTIME_STORE === "file" && process.env.ALLOW_FILE_RUNTIME_STORE_IN_PRODUCTION === "true") fail("Production runtime store cannot be file with ALLOW_FILE_RUNTIME_STORE_IN_PRODUCTION=true for trusted deploys");
console.log("validate_production_config_hard_fail: PASS");
