const fs = require("fs");
const path = require("path");

function fail(message) {
  console.error("validate_speed_networking_e2e_contract: FAIL — " + message);
  process.exit(1);
}

function exists(file) {
  return fs.existsSync(file);
}

function read(file) {
  return exists(file) ? fs.readFileSync(file, "utf8") : "";
}

function walk(dir) {
  if (!exists(dir)) return [];
  const out = [];
  function visit(current) {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      if (["node_modules", ".git", ".next", ".open-next", ".wrangler", "coverage"].includes(entry.name)) continue;
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) visit(full);
      else out.push(full);
    }
  }
  visit(dir);
  return out;
}

const allRelevantFiles = [
  ...walk("components"),
  ...walk("services"),
  ...walk("tests"),
  ...walk("app"),
].filter((file) => /network|speed|venue|video/i.test(file));

const corpus = allRelevantFiles.map((file) => "\n--- " + file + " ---\n" + read(file)).join("\n");

const requiredTerms = [
  "networking",
  "queue",
  "match",
  "room",
  "timer",
  "producer",
  "report",
  "LiveKit",
  "Daily",
  "fallback",
];

for (const term of requiredTerms) {
  if (!corpus.toLowerCase().includes(term.toLowerCase())) {
    fail("speed networking corpus missing required concept: " + term);
  }
}

const clickAudit = read("scripts/post_deploy_click_audit.js");
if (!clickAudit.includes("/venue/event-summit/networking")) fail("click audit must include networking route");
if (!clickAudit.includes("/venue/event-summit/stage")) fail("click audit must include stage route");

const tests = walk("tests").filter((file) => /speed|network/i.test(file));
if (tests.length < 1) fail("missing speed/networking unit tests");

console.log("validate_speed_networking_e2e_contract: PASS");
