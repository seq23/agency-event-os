const fs = require("fs");

const target = "lib/auth/v5RouteAuthorization.ts";
const text = fs.readFileSync(target, "utf8");

const requiredOperatorEventSurfaces = [
  "setup",
  "access",
  "agenda",
  "communications",
  "venue",
  "run-of-show",
  "crew",
  "approval-queue",
  "video-health",
  "incidents",
  "change-control",
  "speakers",
  "sponsors",
  "attendee-flow",
  "assets",
  "inbox",
  "producer",
  "timeline",
  "tasks",
  "talent",
  "vendors",
  "report",
  "analytics",
  "preview",
  "publish",
];

const missing = requiredOperatorEventSurfaces.filter((surface) => !text.includes(`"${surface}"`));

if (missing.length) {
  console.error("validate_operator_day1_event_surface_scope: FAIL");
  console.error("Missing operator Day 1 event surfaces:");
  for (const surface of missing) console.error(`- ${surface}`);
  process.exit(1);
}

console.log("validate_operator_day1_event_surface_scope: PASS");
