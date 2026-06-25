const fs = require("fs");
const canonical = ".github/workflows/publish-event-config.yml";
if (!fs.existsSync(canonical)) throw new Error("Missing canonical publish-event-config workflow.");
if (fs.existsSync(".github/workflows/event-config-publish.yml")) throw new Error("Legacy event-config-publish workflow name must not exist.");
const workflow = fs.readFileSync(canonical, "utf8");
const importer = fs.readFileSync("scripts/import_event_config_package.js", "utf8");
for (const token of ["required: true", "EVENT_CONFIG_PACKAGE", "node scripts/import_event_config_package.js", "git diff --quiet -- data/events data/access public/events", "peter-evans/create-pull-request"]) {
  if (!workflow.includes(token)) throw new Error(`Workflow missing publish invariant: ${token}`);
}
if (workflow.includes("${{ inputs.event_config_package }}") && workflow.includes("run: |")) throw new Error("Workflow must not interpolate raw workflow input directly inside multiline shell run blocks.");
for (const token of ["event-config-packages/", "forbidden", "Secret-like value", "manifest.slug", "copyTree"]) {
  if (!importer.includes(token)) throw new Error(`Importer missing safety invariant: ${token}`);
}
console.log("validate_v5_publishing: PASS");
