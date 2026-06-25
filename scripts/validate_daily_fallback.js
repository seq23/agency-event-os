const fs = require("fs");
const path = require("path");

const root = process.cwd();
const failures = [];

function read(rel) {
  const full = path.join(root, rel);
  if (!fs.existsSync(full)) {
    failures.push(`Missing required file: ${rel}`);
    return "";
  }
  return fs.readFileSync(full, "utf8");
}

const requiredFiles = [
  "services/video/DailyVideoProvider.ts",
  "services/video/videoFallbackPolicy.ts",
  "app/api/video/daily-token/route.ts",
  "components/video/DailyVideoRoom.tsx",
  "components/testing/TestingConsole.tsx",
  "docs/DAILY_AUTOMATIC_FALLBACK.md",
  "docs/POST_DEPLOYMENT_SMOKE_TEST.md",
  "scripts/post_deploy_smoke_test.js",
  "tests/unit/dailyProvider.test.ts",
  "tests/unit/videoFallbackPolicy.test.ts",
];

for (const rel of requiredFiles) read(rel);

const envExample = read(".env.example");
for (const key of ["DAILY_API_KEY", "DAILY_API_BASE_URL", "DAILY_DOMAIN", "DAILY_FALLBACK_ENABLED"]) {
  if (!envExample.includes(`${key}=`)) failures.push(`Missing Daily env example key: ${key}`);
}

const policy = read("services/video/videoFallbackPolicy.ts");
for (const phrase of [
  '["livekit", "cloudflare_stream", "daily", "zoom_sdk", "google_meet"]',
  'producerPermissionRequiredForDaily: false',
]) {
  if (!policy.includes(phrase)) failures.push(`Fallback policy missing phrase: ${phrase}`);
}

const dailyProvider = read("services/video/DailyVideoProvider.ts");
for (const phrase of ["/meeting-tokens", "DAILY_API_KEY is required", "createOrGetRoom", "fallbackAutomatic: true"]) {
  if (!dailyProvider.includes(phrase)) failures.push(`Daily provider missing phrase: ${phrase}`);
}
if (/DAILY_API_KEY[^\n]+NEXT_PUBLIC/.test(dailyProvider)) {
  failures.push("Daily API key appears to be exposed in a public/client context.");
}


const postDeploySmoke = read("scripts/post_deploy_smoke_test.js");
for (const phrase of ["/api/video/daily-token", "api-safe-failure", "expected safe auth/config failure", "mustContain", "protected"]) {
  if (!postDeploySmoke.includes(phrase)) failures.push(`Post-deploy smoke test missing strict smoke invariant: ${phrase}`);
}
for (const staleSmokePattern of ["visible404", "response.status < 500", "Daily fallback route returned"]) {
  if (postDeploySmoke.includes(staleSmokePattern)) failures.push(`Post-deploy smoke test still contains stale permissive invariant: ${staleSmokePattern}`);
}

const testingConsole = read("components/testing/TestingConsole.tsx");
for (const phrase of ["Live deployment smoke diagnostics", "snapshot.smokeChecks", "Daily automatic fallback", "Zoom or Google Meet"]) {
  if (!testingConsole.includes(phrase)) failures.push(`Testing Console missing phrase: ${phrase}`);
}

const liveKitSurface = read("components/venue/LiveKitVideoSurface.tsx");
if (!liveKitSurface.includes("Automatic fallback uses Cloudflare Stream before Daily")) {
  failures.push("LiveKit surface still has stale fallback copy.");
}

const staleFiles = [
  "components/venue/LiveKitVideoSurface.tsx",
  "components/testing/TestingConsole.tsx",
  "docs/VIDEO_PROVIDER_ABSTRACTION_7.md",
  "docs/WHITE_LABEL_BACKUP_ROOMS.md",
  "docs/TESTING_CONSOLE.md",
];
for (const rel of staleFiles) {
  const text = read(rel);
  if (text.includes("Backup rooms remain Zoom or Google Meet links")) failures.push(`Stale Zoom/Meet-only language in ${rel}`);
}

if (failures.length) {
  console.error("Daily fallback validation failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Daily fallback validation passed.");
