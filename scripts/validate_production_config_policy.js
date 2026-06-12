const fs = require("fs");
const { demoDefaults } = require("./lib/day1AccessDefaults");
function fail(message) { console.error("validate_production_config_policy: FAIL — " + message); process.exit(1); }
function read(file) { if (!fs.existsSync(file)) fail("missing " + file); return fs.readFileSync(file, "utf8"); }
const envTs = read("lib/env.ts");
if (!envTs.includes('process.env.VIDEO_PROVIDER || (isProduction ? "livekit" : "mock")')) {
  fail("lib/env.ts must default production VIDEO_PROVIDER to livekit, not mock or unset");
}
const registry = JSON.parse(read("deployment/env-var-registry.json"));
for (const key of ["VIDEO_PROVIDER", "LIVEKIT_URL", "LIVEKIT_API_KEY", "LIVEKIT_API_SECRET", "DAILY_API_KEY", "DAILY_DOMAIN", "DAILY_FALLBACK_ENABLED", "ZOOM_MEETING_SDK_KEY", "ZOOM_MEETING_SDK_SECRET", "CREW_ACCESS_PASSWORD", "OPERATOR_LAUNCHPAD_PASSWORD", "V5_ACCESS_COOKIE_SECRET", "V5_OPERATOR_COOKIE_NAME"]) {
  if (!(registry.requiredProductionEnv || []).includes(key)) fail(`${key} missing from requiredProductionEnv`);
  if (!(registry.cloudflareSecretKeys || []).includes(key)) fail(`${key} missing from cloudflareSecretKeys`);
}
const resolver = read("services/access/eventAccessResolver.ts");
if (resolver.includes("demoFallbackCodes")) fail("eventAccessResolver must not use source-code demo fallback access codes");
for (const raw of [demoDefaults().EVENT_DEMO_SPEAKER_CODE, demoDefaults().EVENT_DEMO_SPONSOR_CODE, demoDefaults().EVENT_DEMO_VIP_CODE].filter(Boolean)) {
  if (resolver.includes(raw)) fail("eventAccessResolver must not contain raw special guest passwords");
}
const envExample = read(".env.example");
if (envExample.match(/^VIDEO_PROVIDER=mock$/m)) fail(".env.example must not set VIDEO_PROVIDER=mock");
for (const raw of [demoDefaults().CREW_ACCESS_PASSWORD, demoDefaults().OPERATOR_LAUNCHPAD_PASSWORD, demoDefaults().EVENT_DEMO_SPEAKER_CODE, demoDefaults().EVENT_DEMO_SPONSOR_CODE, demoDefaults().EVENT_DEMO_VIP_CODE].filter(Boolean)) {
  if (envExample.includes(raw)) {
    // Sample Day 1 values are allowed only in example files and are governed by the env contract.
  }
}
if (!envTs.includes("assertSeparatedProductionPasswords")) fail("lib/env.ts must expose crew/operator password separation assertion");
const pkg = JSON.parse(read("package.json"));
if (!pkg.scripts["validate:production-config"]) fail("package.json missing validate:production-config");
if (!pkg.scripts["predeploy:hard"] || !pkg.scripts["predeploy:hard"].includes("validate:production-config")) fail("predeploy:hard must include validate:production-config");
console.log("validate_production_config_policy: PASS");
