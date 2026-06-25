const fs = require("fs");
const requiredFiles = [
  "app/production-access/page.tsx",
  "app/production-access/crew/page.tsx",
  "app/production-access/special-guest/page.tsx",
  "app/production-access/logout/route.ts",
  "services/access/eventAccessResolver.ts",
  "services/access/accessAuditService.ts",
  "lib/auth/productionAccess.ts",
  "lib/auth/v5RouteAuthorization.ts",
  "middleware.ts",
];
const failures = [];
for (const file of requiredFiles) if (!fs.existsSync(file)) failures.push(`${file} is missing`);
for (const [file, needle] of [
  ["lib/auth/productionAccess.ts", "HMAC"],
  ["lib/auth/productionAccess.ts", "httpOnly"],
  ["middleware.ts", "canSpecialGuestAccessPath"],
  ["services/access/eventAccessResolver.ts", "envKey"],
  ["services/access/accessAuditService.ts", "access_denied"],
]) {
  if (fs.existsSync(file) && !fs.readFileSync(file, "utf8").includes(needle)) failures.push(`${file} must include ${needle}`);
}
if (failures.length) { console.error("Access gate validation failed:"); failures.forEach((failure) => console.error(`- ${failure}`)); process.exit(1); }
console.log("Access gate validation passed.");
