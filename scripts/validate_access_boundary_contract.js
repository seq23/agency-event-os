const fs = require("fs");
function fail(message) { console.error("validate_access_boundary_contract: FAIL — " + message); process.exit(1); }
function read(file) { if (!fs.existsSync(file)) fail("missing " + file); return fs.readFileSync(file, "utf8"); }
const envTs = read("lib/env.ts");
const productionAccess = read("lib/auth/productionAccess.ts");
const routeAuth = read("lib/auth/v5RouteAuthorization.ts");
const crew = read("app/production-access/crew/page.tsx");
const operator = read("app/production-access/operator/page.tsx");
const launchpad = read("app/production-access/launchpad/page.tsx");
const middleware = read("middleware.ts");
if (!envTs.includes("OPERATOR_LAUNCHPAD_PASSWORD")) fail("env missing OPERATOR_LAUNCHPAD_PASSWORD");
if (!envTs.includes("assertSeparatedProductionPasswords")) fail("env must hard-fail matching crew/operator passwords");
if (!productionAccess.includes('kind: "operator"')) fail("V5 access cookie payload must include operator kind");
if (!crew.includes("getCrewAccessPassword") || crew.includes('redirect("/production-access/launchpad")')) fail("crew gate must use crew password and must not redirect directly to launchpad");
if (!operator.includes("getOperatorLaunchpadPassword") || !operator.includes('kind: "operator"')) fail("operator gate must use operator password and set operator cookie");
if (!launchpad.includes('payload.kind === "operator"')) fail("launchpad must require operator cookie");
if (launchpad.includes('payload.kind === "crew"')) fail("launchpad must not accept crew cookie");
if (!routeAuth.includes("canOperatorAccessPath")) fail("route authorization must include operator access path helper");
if (!middleware.includes("readOperatorAccess") || !middleware.includes("canOperatorAccessPath")) fail("middleware must check operator access separately");

if (operator.includes('accessKind: "crew"')) fail("operator gate must not log operator attempts as crew access");
if (!operator.includes('accessKind: "operator"')) fail("operator gate must log operator accessKind");
if (crew.includes('"executive_producer"') || crew.includes('"producer"')) fail("crew gate must not offer producer/executive_producer roles; those belong to operator/admin access");
if (crew.includes('Enter production launchpad') || crew.includes('redirect("/production-access/launchpad")')) fail("crew gate must not promise or redirect to operator launchpad");
if (routeAuth.includes('pathname.startsWith("/app/events/") && !pathname.includes("/new")')) fail("operator access must use an explicit event-surface allowlist, not broad /app/events access");
for (const forbidden of ['"setup"', '"publish"', '"access"', '"report"']) {
  if (routeAuth.includes(forbidden) && routeAuth.includes('operatorEventSurfaceSuffixes')) fail(`operator route allowlist must not include high-risk admin surface ${forbidden}`);
}
const runtimeStore = read("services/runtime/runtimeStore.ts");
const v4Types = read("types/v4.ts");
if (!runtimeStore.includes('"operator"')) fail("runtime access attempt type must include operator");
if (!v4Types.includes('"operator"')) fail("V4AccessKind must include operator");
console.log("validate_access_boundary_contract: PASS");
