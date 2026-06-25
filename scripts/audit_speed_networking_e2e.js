const baseUrl = process.env.SMOKE_BASE_URL;
if (!baseUrl) {
  console.log("audit_speed_networking_e2e: SKIP — SMOKE_BASE_URL is not set.");
  process.exit(0);
}

function fail(message) {
  console.error("audit_speed_networking_e2e: FAIL — " + message);
  process.exit(1);
}

(async () => {
  const route = "/venue/event-summit/networking";
  const response = await fetch(new URL(route, baseUrl));
  const body = await response.text();
  if (response.status >= 500) fail(`${route} returned ${response.status}`);
  for (const term of ["network", "queue", "match", "timer"]) {
    if (!body.toLowerCase().includes(term)) fail(`${route} missing ${term}`);
  }
  console.log("audit_speed_networking_e2e: PASS");
})().catch((error) => fail(error instanceof Error ? error.message : String(error)));
