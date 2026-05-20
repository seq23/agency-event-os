const fs = require("fs");

function fail(message) {
  console.error(`validate_smoke_test_freshness: FAIL — ${message}`);
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync("deployment/cloudflare-required-secrets.json", "utf8"));
const smoke = fs.readFileSync("scripts/post_deploy_smoke_test.js", "utf8");

for (const route of manifest.canonicalSmokeRoutes) {
  if (!smoke.includes(route)) fail(`post_deploy_smoke_test.js missing canonical smoke route ${route}`);
}

for (const route of manifest.forbiddenStaleSmokeRoutes || []) {
  if (smoke.includes(route)) fail(`post_deploy_smoke_test.js contains stale route ${route}`);
}

for (const marker of manifest.canonicalSmokeMarkers) {
  if (!smoke.includes(marker)) fail(`post_deploy_smoke_test.js missing canonical marker ${marker}`);
}

for (const marker of manifest.forbiddenStaleSmokeMarkers || []) {
  if (smoke.includes(marker)) fail(`post_deploy_smoke_test.js contains stale marker ${marker}`);
}

if (!smoke.includes("SMOKE_BASE_URL") || !smoke.includes("NEXT_PUBLIC_APP_URL")) {
  fail("post_deploy_smoke_test.js must require SMOKE_BASE_URL or NEXT_PUBLIC_APP_URL");
}

console.log("validate_smoke_test_freshness: PASS");
