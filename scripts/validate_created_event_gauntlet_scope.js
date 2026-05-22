const fs = require("fs");

const target = "tests/e2e/day1-showtime-master-gauntlet.spec.ts";
const text = fs.readFileSync(target, "utf8");

const required = [
  'getByTestId("event-scoped-day1-command-links")',
  '`/app/events/${createdEventSlug}/run-of-show`',
  '`/app/events/${createdEventSlug}/crew`',
  '`/app/events/${createdEventSlug}/access`',
  '`/app/events/${createdEventSlug}/approval-queue`',
  '`/admin/testing/${createdEventSlug}`',
];

const missing = required.filter((needle) => !text.includes(needle));
if (missing.length) {
  console.error("validate_created_event_gauntlet_scope: FAIL");
  console.error("Missing created-event scoped proof markers:");
  for (const item of missing) console.error(`- ${item}`);
  process.exit(1);
}

const createdEventBlockStart = text.indexOf('const createdEventSlug = "playwright-day1-showtime-master";');
const streamyardProofStart = text.indexOf("// App-controlled StreamYard", createdEventBlockStart);
if (createdEventBlockStart === -1 || streamyardProofStart === -1) {
  console.error("validate_created_event_gauntlet_scope: FAIL");
  console.error("Could not locate created-event proof block.");
  process.exit(1);
}

const createdEventBlock = text.slice(createdEventBlockStart, streamyardProofStart);
if (createdEventBlock.includes('/production-access/launchpad')) {
  console.error("validate_created_event_gauntlet_scope: FAIL");
  console.error("Created-event proof must not route through the global/demo operator launchpad.");
  process.exit(1);
}

if (createdEventBlock.includes('/app/events/event-summit') || createdEventBlock.includes('/admin/testing/event-summit')) {
  console.error("validate_created_event_gauntlet_scope: FAIL");
  console.error("Created-event proof contains event-summit-scoped links.");
  process.exit(1);
}

console.log("validate_created_event_gauntlet_scope: PASS");
