import fs from "node:fs";

const c = JSON.parse(fs.readFileSync("_browser_suite_contract.json", "utf8"));
const b = c.browser_suite;
if (!b?.command || !Array.isArray(b.projects) || !b.projects.length) throw new Error("invalid browser suite contract");
if (b.required_failed !== 0) throw new Error("required_failed must equal 0");
if (b.expected_collected !== undefined && (!Number.isInteger(b.expected_collected) || b.expected_collected < 1)) throw new Error("expected_collected invalid");
if (b.count_policy === undefined && b.expected_collected === undefined) throw new Error("count policy missing");
if (!Array.isArray(b.registered_skips)) throw new Error("registered_skips missing");

const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
const localVisualProof = pkg.scripts?.["release:local-visual-proof"] || "";
if (localVisualProof !== "node scripts/run_local_visual_proof_with_recovery.mjs") {
  throw new Error("release:local-visual-proof must use deterministic recovery wrapper");
}

const recoveryScriptPath = "scripts/run_local_visual_proof_with_recovery.mjs";
if (!fs.existsSync(recoveryScriptPath)) throw new Error(`${recoveryScriptPath} missing`);
const recoveryScript = fs.readFileSync(recoveryScriptPath, "utf8");
const requiredMarkers = [
  "local-visual-proof-recovery.md",
  "ERR_CONNECTION_REFUSED",
  "Test timeout",
  "Server is approaching the used memory threshold",
  "--timeout=90000",
  "git push origin main",
  "Isolation commands",
  "LOCAL HARNESS / NEXT DEV RESTART / TIMEOUT SUSPECTED",
  "FAILED-SPEC-ONLY CONTRACT",
  "failureHeaderPattern",
  "failedSummaryBlock",
  "One isolation command per failed spec file",
];
for (const marker of requiredMarkers) {
  if (!recoveryScript.includes(marker)) {
    throw new Error(`local visual proof recovery wrapper missing marker: ${marker}`);
  }
}


if (recoveryScript.includes("const summaryPattern") || recoveryScript.includes("summaryPattern = /\\[")) {
  throw new Error("local visual proof recovery wrapper must not use broad passing-line parser");
}

console.log(
  "BROWSER SUITE CONTRACT: PASS",
  JSON.stringify({
    command: b.command,
    projects: b.projects,
    expected_collected: b.expected_collected ?? b.count_policy,
    registered_skips: b.registered_skips.length,
    local_visual_proof_recovery: true,
  }),
);
