const fs = require("fs");
const { execFileSync } = require("child_process");
function read(file) { return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : ""; }
function fail(message) { console.error(message); process.exit(1); }
execFileSync("node", ["scripts/validate_v6_completion_contract.js"], { stdio: "inherit" });
execFileSync("node", ["scripts/validate_v5_no_secrets.js"], { stdio: "inherit" });
execFileSync("node", ["scripts/validate_v5_event_config_schema.js"], { stdio: "inherit" });
execFileSync("node", ["scripts/validate_v5_publishing.js"], { stdio: "inherit" });
execFileSync("node", ["scripts/validate_v5_runtime_boundaries.js"], { stdio: "inherit" });
const migrationNames = fs.readdirSync("db/migrations").filter((name) => /^\d{4}_.*\.sql$/.test(name));
const nums = new Set();
for (const migration of migrationNames) {
  const num = migration.slice(0, 4);
  if (nums.has(num)) fail(`Duplicate migration number ${num}`);
  nums.add(num);
}
const routeAuth = read("lib/auth/v5RouteAuthorization.ts");
if (routeAuth.includes("pathname.includes(`/${eventId}`)")) fail("Route authorization must not use substring event matching.");
if (!routeAuth.includes("eventIdFromPath") || !routeAuth.includes("canPerformCrewAction")) fail("Route/action authorization helpers missing.");
const videoPolicy = read("services/video/roomFallbackService.ts") + read("services/video/videoFallbackPolicy.ts");
if (!videoPolicy.includes("zoom") || !videoPolicy.includes("confirmedByCrew")) fail("Zoom crew confirmation is missing.");
if (videoPolicy.includes("provider === \"zoom\" && canAutoSwitch")) fail("Zoom must not auto-switch.");

const prodRuntimeImportOffenders = [];
for (const top of ["app", "components", "lib", "services"]) {
  if (!fs.existsSync(top)) continue;
  for (const file of fs.readdirSync(top, { recursive: true }).filter((name) => /\.(ts|tsx)$/.test(name))) {
    const full = `${top}/${file}`;
    if (full === "services/runtime/v5RuntimeStateStore.ts") continue;
    const body = read(full);
    if (body.includes("@/services/runtime/v5RuntimeStateStore")) prodRuntimeImportOffenders.push(full);
  }
}
if (prodRuntimeImportOffenders.length) fail(`Production code must use getRuntimeStore(), not v5RuntimeStateStore: ${prodRuntimeImportOffenders.join(", ")}`);
const crewPage = read("app/production-access/crew/page.tsx");
if (!crewPage.includes('name="crewRole"') || !crewPage.includes('technical_director')) fail("Crew access must allow explicit crew role selection so capability-gated actions are reachable.");
const accessResolver = read("services/access/eventAccessResolver.ts");
if (!accessResolver.includes("crewRole") || !accessResolver.includes("role: crewRole")) fail("Crew resolver must preserve selected crew role in the access payload.");
const env = read("lib/env.ts");
if (!env.includes("ALLOW_MOCK_VIDEO_PROVIDER_IN_PRODUCTION") || !env.includes("VIDEO_PROVIDER=mock is not allowed in production")) fail("Production env must fail loudly when VIDEO_PROVIDER=mock without explicit override.");

const smoke = read("scripts/post_deploy_smoke_test.js");
if (smoke.includes("visible404") || smoke.includes("status < 500")) fail("Smoke test must not accept broad non-500 statuses.");
for (const forbidden of ["TODO", "placeholder", "coming soon"]){
  const offenders = [];
  for (const file of fs.readdirSync("components", { recursive: true }).filter((name) => /\.(tsx|ts)$/.test(name))) {
    const body = read(`components/${file}`);
    if (body.toLowerCase().replace(/withplaceholder/g, "").includes(forbidden.toLowerCase())) offenders.push(`components/${file}`);
  }
  if (offenders.length) fail(`Anti-theater keyword ${forbidden} found in ${offenders.join(", ")}`);
}
console.log("validate_v6_hard_fail: PASS");
