const fs = require("fs");

const checks = [
  ["app/page.tsx", "Join an Event"],
  ["app/page.tsx", "/join"],
  ["app/page.tsx", "Production Access"],
  ["app/page.tsx", "/production-access"],
  ["app/page.tsx", "Preview demo venue"],
  ["app/join/page.tsx", "resolveEventJoinCode"],
  ["services/events/eventStateResolver.ts", "draft"],
  ["services/events/eventStateResolver.ts", "upcoming"],
  ["services/events/eventStateResolver.ts", "live"],
  ["services/events/eventStateResolver.ts", "archived"],
];

const failures = [];
for (const [file, needle] of checks) {
  if (!fs.existsSync(file)) failures.push(`${file} is missing`);
  else if (!fs.readFileSync(file, "utf8").includes(needle)) failures.push(`${file} must include ${needle}`);
}

if (failures.length) {
  console.error("V4 front door validation failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log("V4 front door validation passed.");
