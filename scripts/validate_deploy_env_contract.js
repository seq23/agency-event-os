const fs = require("fs");

function fail(message) {
  console.error(`validate_deploy_env_contract: FAIL — ${message}`);
  process.exit(1);
}

function read(file) {
  if (!fs.existsSync(file)) fail(`missing required file ${file}`);
  return fs.readFileSync(file, "utf8");
}

const manifest = JSON.parse(read("deployment/cloudflare-required-secrets.json"));
const envExample = read(".env.example");
const parityDocs = [
  "docs/DEPLOYMENT_PARITY_CHECKLIST.md",
  "docs/CHAT_HANDOFF_DEPLOYMENT_PARITY_RULES.md",
  "docs/START_HERE_FOR_FUTURE_CHATS.md",
  "docs/DEPLOYMENT_ENV_CHECKLIST.md"
].map(read).join("\n");
const accessConfig = JSON.parse(read("data/access/event-access-config.json"));

const configEnvKeys = new Set();
for (const eventConfig of Object.values(accessConfig.events || {})) {
  if (eventConfig.crewPasswordEnvKey) configEnvKeys.add(eventConfig.crewPasswordEnvKey);
  for (const item of eventConfig.specialGuestCodes || []) {
    if (item.envKey) configEnvKeys.add(item.envKey);
  }
}

for (const key of configEnvKeys) {
  if (!manifest.requiredSecrets.includes(key)) fail(`access config env key ${key} missing from cloudflare-required-secrets.json`);
}

const requiredDocKeys = [
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

for (const key of requiredDocKeys) {
  if (!manifest.requiredSecrets.includes(key)) fail(`${key} missing from cloudflare-required-secrets.json`);
  if (!parityDocs.includes(key)) fail(`${key} missing from deployment parity docs`);
}

const envExampleRequired = [
  "CREW_ACCESS_PASSWORD",
  "OPERATOR_LAUNCHPAD_PASSWORD",
  "V5_ACCESS_COOKIE_SECRET",
  "V5_OPERATOR_COOKIE_NAME",
  "EVENT_DEMO_SPEAKER_CODE",
  "EVENT_DEMO_SPONSOR_CODE",
  "EVENT_DEMO_VIP_CODE"
];

for (const key of envExampleRequired) {
  if (!envExample.includes(key)) fail(`${key} missing from .env.example`);
}

console.log("validate_deploy_env_contract: PASS");
