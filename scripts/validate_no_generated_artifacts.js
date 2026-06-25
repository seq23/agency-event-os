#!/usr/bin/env node
const fs = require("fs");

const forbidden = [
  ".open-next",
  ".next",
  ".wrangler",
  ".runtime-data",
  "test-results",
  "playwright-report",
  "logs",
  "coverage"
];

const present = forbidden.filter((target) => fs.existsSync(target));

if (present.length) {
  console.error("validate_no_generated_artifacts: FAIL — generated/runtime artifacts present:");
  for (const item of present) console.error(`- ${item}`);
  process.exit(1);
}

console.log("validate_no_generated_artifacts: PASS");
