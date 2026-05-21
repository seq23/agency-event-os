const baseUrl = process.env.SMOKE_BASE_URL || process.env.NEXT_PUBLIC_APP_URL;
if (!baseUrl) {
  console.log("post_deploy_smoke_test: SKIP (set SMOKE_BASE_URL or NEXT_PUBLIC_APP_URL)");
  process.exit(0);
}

const checks = [
  { path: "/", kind: "public", mustContain: "Join an Event" },
  { path: "/join", kind: "public", mustContain: "Event code" },
  { path: "/production-access", kind: "public", mustContain: "Production Access" },
  { path: "/production-access/crew", kind: "public", mustContain: "Crew password" },
  { path: "/production-access/operator", kind: "public", mustContain: "Operator launchpad password" },
  { path: "/production-access/special-guest", kind: "public", mustContain: "Special guest password" },
  { path: "/request-event", kind: "public", mustContain: "Plan an Event" },
  { path: "/events/demo", kind: "public" },
  { path: "/venue/demo/lobby", kind: "public" },
  { path: "/venue/event-summit/stage", kind: "public" },
  { path: "/venue/event-summit/sessions", kind: "public" },
  { path: "/venue/event-summit/expo", kind: "public" },
  { path: "/venue/event-summit/help", kind: "public" },
  { path: "/app", kind: "protected" },
  { path: "/admin/testing", kind: "protected" },
  { path: "/api/video/livekit-token", kind: "api-safe-failure" },
  { path: "/api/video/daily-token", kind: "api-safe-failure" },
  { path: "/api/video/zoom-signature", kind: "api-safe-failure" },
];

async function run() {
  const failures = [];
  for (const check of checks) {
    const response = await fetch(new URL(check.path, baseUrl), { redirect: "manual" });
    const body = await response.text().catch(() => "");
    if (check.kind === "public" && response.status !== 200) failures.push(`${check.path} expected 200 got ${response.status}`);
    if (check.kind === "protected" && !(response.status >= 300 && response.status < 400)) failures.push(`${check.path} expected redirect guard got ${response.status}`);
    if (check.kind === "api-safe-failure" && ![400, 401, 403, 405].includes(response.status)) failures.push(`${check.path} expected safe auth/config failure got ${response.status}`);
    if (check.mustContain && !body.includes(check.mustContain)) failures.push(`${check.path} missing marker ${check.mustContain}`);
  }
  if (failures.length) {
    console.error(failures.join("\n"));
    process.exit(1);
  }
  console.log("post_deploy_smoke_test: PASS");
}
run().catch((error) => { console.error(error); process.exit(1); });
