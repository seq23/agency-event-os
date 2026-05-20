const baseUrl = process.env.SMOKE_BASE_URL || process.env.NEXT_PUBLIC_APP_URL;

if (!baseUrl) {
  console.log("post_deploy_role_flow_audit: SKIP (set SMOKE_BASE_URL or NEXT_PUBLIC_APP_URL)");
  process.exit(0);
}

const checks = [
  { path: "/production-access/crew", mustContain: ["Crew password", "CrewAccess-2026!"] },
  { path: "/production-access/special-guest", mustContain: ["Special guest password", "SpeakerGuest-2026!", "SponsorGuest-2026!", "VIPGuest-2026!"] },
  { path: "/production-access", mustContain: ["Production Access", "Crew / Production Team", "Conference Special Guest"] },
];

function toUrl(pathname) {
  return new URL(pathname, baseUrl);
}

async function run() {
  const failures = [];
  for (const check of checks) {
    const response = await fetch(toUrl(check.path), { redirect: "manual" });
    const body = await response.text().catch(() => "");
    if (response.status !== 200) failures.push(check.path + " expected 200 got " + response.status);
    for (const marker of check.mustContain) {
      if (!body.includes(marker)) failures.push(check.path + " missing marker " + marker);
    }
    if (body.includes("__next_error__") || body.includes("Internal Server Error") || body.includes("Application error")) {
      failures.push(check.path + " contains generic server error marker");
    }
  }

  if (failures.length) {
    console.error("post_deploy_role_flow_audit: FAIL");
    for (const failure of failures) console.error("- " + failure);
    process.exit(1);
  }

  console.log("post_deploy_role_flow_audit: PASS");
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
