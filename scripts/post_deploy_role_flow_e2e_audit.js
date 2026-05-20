const routes = [
  "/production-access",
  "/production-access/crew",
  "/production-access/special-guest",
  "/app/events/event-summit",
  "/client/west-peek/events/event-summit",
  "/speaker/events/event-summit",
  "/sponsor/events/event-summit",
  "/crew/events/event-summit",
  "/venue/event-summit/lobby",
];

const baseUrl = process.env.SMOKE_BASE_URL;
if (!baseUrl) {
  console.log("post_deploy_role_flow_e2e_audit: SKIP — SMOKE_BASE_URL is not set.");
  process.exit(0);
}

function fail(message) {
  console.error("post_deploy_role_flow_e2e_audit: FAIL — " + message);
  process.exit(1);
}

(async () => {
  for (const route of routes) {
    const response = await fetch(new URL(route, baseUrl));
    const body = await response.text();
    if (response.status >= 500) fail(`${route} returned ${response.status}`);
    for (const term of ["__next_error__", "Internal Server Error", "Application error", "digest"]) {
      if (body.includes(term)) fail(`${route} contained ${term}`);
    }
  }
  console.log("post_deploy_role_flow_e2e_audit: PASS");
})().catch((error) => fail(error instanceof Error ? error.message : String(error)));
