const fs = require("fs");

function fail(message) {
  console.error("validate_click_audit_contract: FAIL — " + message);
  process.exit(1);
}

const file = "scripts/post_deploy_click_audit.js";
if (!fs.existsSync(file)) fail("missing scripts/post_deploy_click_audit.js");

const body = fs.readFileSync(file, "utf8");

const requiredTerms = [
  "SMOKE_BASE_URL",
  "/venue/demo/lobby",
  "/venue/event-summit/stage",
  "/production-access",
  "/production-access/crew",
  "/production-access/special-guest",
  "__next_error__",
  "Internal Server Error",
  "Application error",
  "digest",
  "500",
  "502",
  "503",
  "504",
  "href=",
  "redirect",
];

for (const term of requiredTerms) {
  if (!body.includes(term)) fail("click audit missing required term " + term);
}

const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
const scripts = pkg.scripts || {};
if (!scripts["postdeploy:click-audit"] || !scripts["postdeploy:click-audit"].includes("post_deploy_click_audit.js")) {
  fail("package.json missing postdeploy:click-audit script");
}
const full = scripts["postdeploy:full"] || "";
const fullLegacy = scripts["postdeploy:full:legacy"] || "";
const strictWrapper = "scripts/run_postdeploy_strict.js";

if (!full) {
  fail("package.json missing postdeploy:full script");
}

if (full.includes(strictWrapper)) {
  if (!fs.existsSync(strictWrapper)) fail("postdeploy:full points to missing strict wrapper");
  const strictBody = fs.readFileSync(strictWrapper, "utf8");
  for (const requiredStep of [
    "postdeploy:smoke",
    "postdeploy:click-audit",
    "postdeploy:role-flow",
    "postdeploy:video-provider",
    "postdeploy:browser",
    "POSTDEPLOY_BASE_URL",
    "SMOKE_BASE_URL",
    "PLAYWRIGHT_BASE_URL"
  ]) {
    if (!strictBody.includes(requiredStep)) fail("strict postdeploy wrapper missing " + requiredStep);
  }
} else if (!full.includes("postdeploy:smoke") || !full.includes("postdeploy:click-audit")) {
  fail("package.json postdeploy:full must use strict wrapper or include smoke and click audit");
}

if (fullLegacy && (!fullLegacy.includes("postdeploy:smoke") || !fullLegacy.includes("postdeploy:click-audit"))) {
  fail("package.json postdeploy:full:legacy exists but does not include smoke and click audit");
}
if (!scripts["validate:deploy-parity"] || !scripts["validate:deploy-parity"].includes("validate_click_audit_contract.js")) {
  fail("validate:deploy-parity must include validate_click_audit_contract.js");
}

console.log("validate_click_audit_contract: PASS");
