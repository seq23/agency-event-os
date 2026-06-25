#!/usr/bin/env node
const cp = require("child_process");

function resolveBaseUrl() {
  return process.env.POSTDEPLOY_BASE_URL ||
    process.env.SMOKE_BASE_URL ||
    process.env.PLAYWRIGHT_BASE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "";
}

const baseUrl = resolveBaseUrl();

if (!baseUrl) {
  console.error("run_postdeploy_strict: BLOCKED — set POSTDEPLOY_BASE_URL, SMOKE_BASE_URL, PLAYWRIGHT_BASE_URL, or NEXT_PUBLIC_APP_URL.");
  process.exit(2);
}

if (!/^https?:\/\//.test(baseUrl)) {
  console.error(`run_postdeploy_strict: BLOCKED — invalid base URL: ${baseUrl}`);
  process.exit(2);
}

const env = {
  ...process.env,
  POSTDEPLOY_BASE_URL: baseUrl,
  SMOKE_BASE_URL: baseUrl,
  PLAYWRIGHT_BASE_URL: baseUrl
};

const steps = [
  ["postdeploy:smoke", "npm run postdeploy:smoke"],
  ["postdeploy:click-audit", "npm run postdeploy:click-audit"],
  ["postdeploy:role-flow", "npm run postdeploy:role-flow"],
  ["postdeploy:video-provider", "npm run postdeploy:video-provider"],
  ["postdeploy:browser", "npm run postdeploy:browser"]
];

console.log(`run_postdeploy_strict: using base URL ${baseUrl}`);

for (const [label, command] of steps) {
  console.log(`\n==> ${label}`);
  cp.execSync(command, { stdio: "inherit", env });
}

console.log("\nrun_postdeploy_strict: PASS");
