const fs = require("fs");

function fail(message) {
  console.error(`validate_cloudflare_required_secrets_manifest: FAIL — ${message}`);
  process.exit(1);
}

const manifestPath = "deployment/cloudflare-required-secrets.json";
if (!fs.existsSync(manifestPath)) fail("missing deployment/cloudflare-required-secrets.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

if (manifest.workerName !== "west-peek-live") fail("workerName must be west-peek-live");
if (manifest.liveSmokeBaseUrl !== "https://west-peek-live.seq-taylor.workers.dev") fail("liveSmokeBaseUrl must be the deployed Worker URL");
if (!Array.isArray(manifest.requiredSecrets) || manifest.requiredSecrets.length < 10) fail("requiredSecrets must be a non-trivial array");

const required = [
  "CREW_ACCESS_PASSWORD",
  "V5_ACCESS_COOKIE_SECRET",
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
if (defaults.CREW_ACCESS_PASSWORD !== "CrewAccess-2026!") fail("demoDefaults missing crew password");
if (defaults.EVENT_DEMO_SPEAKER_CODE !== "SpeakerGuest-2026!") fail("demoDefaults missing speaker code");
if (defaults.EVENT_DEMO_SPONSOR_CODE !== "SponsorGuest-2026!") fail("demoDefaults missing sponsor code");
if (defaults.EVENT_DEMO_VIP_CODE !== "VIPGuest-2026!") fail("demoDefaults missing VIP code");

console.log("validate_cloudflare_required_secrets_manifest: PASS");
