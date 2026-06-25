const baseUrl = process.env.SMOKE_BASE_URL || process.env.NEXT_PUBLIC_APP_URL;

if (!baseUrl) {
  console.log("post_deploy_video_provider_audit: SKIP (set SMOKE_BASE_URL or NEXT_PUBLIC_APP_URL)");
  process.exit(0);
}

const checks = [
  "/api/video/livekit-token",
  "/api/video/daily-token",
  "/api/video/zoom-signature",
  "/venue/event-summit/stage",
  "/venue/event-summit/sessions/session-breakout-a",
];

function toUrl(pathname) {
  return new URL(pathname, baseUrl);
}

async function run() {
  const failures = [];
  for (const pathname of checks) {
    const response = await fetch(toUrl(pathname), { redirect: "manual" });
    const body = await response.text().catch(() => "");
    if (pathname.startsWith("/api/")) {
      if (![400, 401, 403, 405].includes(response.status)) {
        failures.push(pathname + " expected safe auth/config failure got " + response.status);
      }
    } else if (response.status !== 200) {
      failures.push(pathname + " expected 200 got " + response.status);
    }

    if (body.includes("__next_error__") || body.includes("Internal Server Error") || body.includes("Application error")) {
      failures.push(pathname + " contains generic server error marker");
    }
  }

  if (failures.length) {
    console.error("post_deploy_video_provider_audit: FAIL");
    for (const failure of failures) console.error("- " + failure);
    process.exit(1);
  }

  console.log("post_deploy_video_provider_audit: PASS");
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
