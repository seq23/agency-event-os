const fs = require("fs");

function fail(message) {
  console.error(`validate_cloudflare_required_secrets_manifest: FAIL — ${message}`);
  process.exit(1);
}

const manifestPath = "deployment/cloudflare-required-secrets.json";
if (!fs.existsSync(manifestPath)) fail("missing deployment/cloudflare-required-secrets.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const registry = JSON.parse(fs.readFileSync("deployment/env-var-registry.json", "utf8"));

if (manifest.workerName !== "west-peek-live") fail("workerName must be west-peek-live");
if (manifest.liveSmokeBaseUrl !== "https://west-peek-live.seq-taylor.workers.dev") fail("liveSmokeBaseUrl must be the deployed Worker URL");
if (!Array.isArray(manifest.requiredSecrets) || manifest.requiredSecrets.length < 10) fail("requiredSecrets must be a non-trivial array");

const required = [
  "CREW_ACCESS_PASSWORD",
  "OPERATOR_LAUNCHPAD_PASSWORD",
  "V5_ACCESS_COOKIE_SECRET",
  "V5_OPERATOR_COOKIE_NAME",
  "EVENT_DEMO_SPEAKER_CODE",
  "EVENT_DEMO_SPONSOR_CODE",
  "EVENT_DEMO_VIP_CODE",
  "AGENCY_EVENT_OS_RUNTIME_STORE",
  "ALLOW_FILE_RUNTIME_STORE_IN_PRODUCTION"
];

for (const key of required) {
  if (!manifest.requiredSecrets.includes(key)) fail(`requiredSecrets missing ${key}`);
}

const defaults = manifest.demoDefaults || {};
const registryDefaults = registry.demoDefaults || {};
for (const key of [
  "CREW_ACCESS_PASSWORD",
  "OPERATOR_LAUNCHPAD_PASSWORD",
  "OWNER_MASTER_ACCESS_PASSWORD",
  "EVENT_DEMO_CLIENT_CODE",
  "EVENT_DEMO_SPEAKER_CODE",
  "EVENT_DEMO_SPONSOR_CODE",
  "EVENT_DEMO_VIP_CODE",
  "EVENT_DEMO_CREW_LITE_CODE",
]) {
  if (!registryDefaults[key]) fail(`registry demoDefaults missing ${key}`);
  if (defaults[key] !== registryDefaults[key]) fail(`manifest demoDefaults for ${key} must match registry demoDefaults`);
}
if (defaults.CREW_ACCESS_PASSWORD === defaults.OPERATOR_LAUNCHPAD_PASSWORD) fail("demoDefaults must keep crew and operator passwords separate");

console.log("validate_cloudflare_required_secrets_manifest: PASS");
