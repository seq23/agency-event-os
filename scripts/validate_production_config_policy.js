const fs = require("fs");
function fail(message) { console.error("validate_production_config_policy: FAIL — " + message); process.exit(1); }
function read(file) { if (!fs.existsSync(file)) fail("missing " + file); return fs.readFileSync(file, "utf8"); }
const envTs = read("lib/env.ts");
if (!envTs.includes('process.env.VIDEO_PROVIDER || (isProduction ? "livekit" : "mock")')) {
  fail("lib/env.ts must default production VIDEO_PROVIDER to livekit, not mock or unset");
}
const registry = JSON.parse(read("deployment/env-var-registry.json"));
for (const key of ["VIDEO_PROVIDER", "LIVEKIT_URL", "LIVEKIT_API_KEY", "LIVEKIT_API_SECRET", "DAILY_API_KEY", "DAILY_DOMAIN", "DAILY_FALLBACK_ENABLED", "ZOOM_MEETING_SDK_KEY", "ZOOM_MEETING_SDK_SECRET", "CREW_ACCESS_PASSWORD", "V5_ACCESS_COOKIE_SECRET"]) {
  if (!(registry.requiredProductionEnv || []).includes(key)) fail(`${key} missing from requiredProductionEnv`);
  if (!(registry.cloudflareSecretKeys || []).includes(key)) fail(`${key} missing from cloudflareSecretKeys`);
}
const resolver = read("services/access/eventAccessResolver.ts");
if (resolver.includes("demoFallbackCodes")) fail("eventAccessResolver must not use source-code demo fallback access codes");
if (resolver.includes("SpeakerGuest-2026!") || resolver.includes("SponsorGuest-2026!") || resolver.includes("VIPGuest-2026!")) {
  fail("eventAccessResolver must not contain raw special guest passwords");
}
const envExample = read(".env.example");
if (envExample.match(/^VIDEO_PROVIDER=mock$/m)) fail(".env.example must not set VIDEO_PROVIDER=mock");
for (const raw of ["CrewAccess-2026!", "SpeakerGuest-2026!", "SponsorGuest-2026!", "VIPGuest-2026!"]) {
  if (envExample.includes(raw)) fail(".env.example must not contain raw Day 1 password " + raw);
}
const pkg = JSON.parse(read("package.json"));
if (!pkg.scripts["validate:production-config"]) fail("package.json missing validate:production-config");
if (!pkg.scripts["predeploy:hard"] || !pkg.scripts["predeploy:hard"].includes("validate:production-config")) fail("predeploy:hard must include validate:production-config");
console.log("validate_production_config_policy: PASS");
