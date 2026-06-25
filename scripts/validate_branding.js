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

const userFacingRoots = [
  "app",
  "components",
  "content",
  "data",
  "emails",
  "lib",
  "public",
  "services",
  "styles",
  "types",
];
const userFacingRootFiles = new Set([
  "README.md",
  "package.json",
  "next.config.js",
  "wrangler.jsonc",
]);

const failures = [];

for (const rel of required) {
  if (!fs.existsSync(path.join(root, rel))) failures.push(`Missing required brand file: ${rel}`);
}

function walk(dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (["node_modules", ".next", ".git", "coverage", ".open-next", "dist", "build", "out", "playwright-report", "test-results"].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

const filesToScan = [];
for (const relRoot of userFacingRoots) filesToScan.push(...walk(path.join(root, relRoot)));
for (const rel of userFacingRootFiles) {
  const full = path.join(root, rel);
  if (fs.existsSync(full)) filesToScan.push(full);
}
for (const rel of allowedOldNameFiles) {
  const full = path.join(root, rel);
  if (fs.existsSync(full)) filesToScan.push(full);
}

for (const file of filesToScan) {
  const rel = path.relative(root, file);
  if (!/\.(ts|tsx|md|json|css|svg|example|js|jsx|jsonc)$/.test(file)) continue;
  const text = fs.readFileSync(file, "utf8");
  if (text.includes("Agency Event OS") && !allowedOldNameFiles.has(rel)) {
    failures.push(`Deprecated user-facing name found in ${rel}`);
  }
}

const wordmarkPath = path.join(root, "components/brand/WestPeekLiveWordmark.tsx");
const wordmark = fs.existsSync(wordmarkPath) ? fs.readFileSync(wordmarkPath, "utf8") : "";
if (!wordmark.includes("text-brand-orange")) failures.push("Wordmark does not use orange for Live!");
if (!wordmark.includes("brand-script")) failures.push("Wordmark does not use script class for Live!");
if (!wordmark.includes("-rotate-6")) failures.push("Wordmark does not skew Live!");

if (failures.length) {
  console.error("Brand validation failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Brand validation passed — scoped to public/user-facing brand surfaces, not internal audit docs.");
