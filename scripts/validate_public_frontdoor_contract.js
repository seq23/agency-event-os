const fs = require("fs");
function fail(message) { console.error("validate_public_frontdoor_contract: FAIL — " + message); process.exit(1); }
function read(file) { if (!fs.existsSync(file)) fail("missing " + file); return fs.readFileSync(file, "utf8"); }
const home = read("app/page.tsx");
const request = read("app/request-event/page.tsx");
const requestAction = read("lib/actions/requestEventActions.ts");
const start = read("app/start/page.tsx");
const startCreate = read("app/start/create-event/page.tsx");
if (!home.includes('href="/join"')) fail("homepage must expose Enter/Join Event public CTA");
if (!home.includes('href="/production-access"')) fail("homepage must expose Production Access CTA");
if (!home.includes('href="/request-event"')) fail("homepage must expose Plan an Event request CTA");
if (home.includes('href="/app') || home.includes("Create First Event")) fail("public homepage must not expose protected app event creation");
for (const token of ["Plan an Event", "Request Event", "Submit event request", "requestEventProduction"]) if (!request.includes(token)) fail("request-event page missing " + token);
for (const token of ["appendRequestEventRecord", "createAuditLog", "sendEmail", "request_event_production"]) if (!requestAction.includes(token)) fail("request-event action missing production intake behavior: " + token);
if (!start.includes("NEXT_PUBLIC_SELF_SERVE_ENABLED") || !start.includes("/request-event")) fail("/start must redirect to request-event while self serve is disabled");
if (!startCreate.includes("SELF_SERVE_EVENT_CREATION_ENABLED") || !startCreate.includes("/request-event")) fail("/start/create-event must stay hidden while self serve is disabled");
console.log("validate_public_frontdoor_contract: PASS");
