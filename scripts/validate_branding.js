const fs = require("fs");
const path = require("path");

const root = process.cwd();
const allowedOldNameFiles = new Set([
  "docs/BRAND_SYSTEM_WEST_PEEK_LIVE.md",
]);

const required = [
  "docs/BRAND_SYSTEM_WEST_PEEK_LIVE.md",
  "docs/BRANDING_ROLLOUT_CHECKLIST.md",
  "docs/MOBILE_TABLET_QA_WEST_PEEK_LIVE.md",
  "components/brand/WestPeekLiveWordmark.tsx",
  "public/brand/west-peek-live-wordmark.svg",
  "public/brand/wp-mark.svg",
];

const failures = [];

for (const rel of required) {
  if (!fs.existsSync(path.join(root, rel))) {
    failures.push(`Missing required brand file: ${rel}`);
  }
}

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (["node_modules", ".next", ".git", "coverage"].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

for (const file of walk(root)) {
  const rel = path.relative(root, file);
  if (!/\.(ts|tsx|md|json|css|svg|example)$/.test(file)) continue;
  const text = fs.readFileSync(file, "utf8");
  const isInternalDoc = rel.startsWith("docs/");
  if (!isInternalDoc && text.includes("Agency Event OS") && !allowedOldNameFiles.has(rel)) {
    failures.push(`Deprecated user-facing name found in ${rel}`);
  }
}

const wordmark = fs.readFileSync(path.join(root, "components/brand/WestPeekLiveWordmark.tsx"), "utf8");
if (!wordmark.includes("text-brand-orange")) failures.push("Wordmark does not use orange for Live!");
if (!wordmark.includes("brand-script")) failures.push("Wordmark does not use script class for Live!");
if (!wordmark.includes("-rotate-6")) failures.push("Wordmark does not skew Live!");

if (failures.length) {
  console.error("Brand validation failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Brand validation passed.");
