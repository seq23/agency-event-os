#!/usr/bin/env node
const fs = require("fs");
const cp = require("child_process");

function fail(message) {
  console.error(message);
  process.exit(1);
}

function requiredNamesFromManifest() {
  const manifestPath = "deployment/cloudflare-required-secrets.json";
  if (!fs.existsSync(manifestPath)) fail(`audit_cloudflare_secret_parity: FAIL — missing ${manifestPath}`);
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  const raw = Array.isArray(manifest) ? manifest : manifest.requiredSecrets || manifest.secrets || manifest.required || [];
  const names = raw.map((entry) => typeof entry === "string" ? entry : entry && entry.name).filter(Boolean);
  if (!names.length) fail("audit_cloudflare_secret_parity: FAIL — no required secret names found in manifest");
  return [...new Set(names)].sort();
}

function liveCloudflareSecretNames() {
  let output;
  try {
    output = cp.execSync("npx wrangler secret list", { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  } catch (error) {
    const stderr = error && error.stderr ? String(error.stderr) : "";
    fail(`audit_cloudflare_secret_parity: FAIL — wrangler secret list failed. Are you logged into Cloudflare?\n${stderr}`);
  }

  let parsed;
  try {
    parsed = JSON.parse(output);
  } catch {
    fail("audit_cloudflare_secret_parity: FAIL — wrangler secret list did not return JSON.");
  }

  return [...new Set(parsed.map((entry) => entry && entry.name).filter(Boolean))].sort();
}

const required = requiredNamesFromManifest();
const live = liveCloudflareSecretNames();
const liveSet = new Set(live);
const missing = required.filter((name) => !liveSet.has(name));
const extra = live.filter((name) => !required.includes(name));

if (missing.length) {
  console.error("audit_cloudflare_secret_parity: FAIL — live Cloudflare secret NAME parity failed.");
  console.error(`Required names: ${required.length}`);
  console.error(`Live names: ${live.length}`);
  console.error(`Missing names: ${missing.length}`);
  for (const name of missing) console.error(`- ${name}`);
  console.error("Secret values were not read or printed.");
  process.exit(1);
}

console.log(`audit_cloudflare_secret_parity: PASS — live Cloudflare Worker has all ${required.length} required secret names.`);
if (extra.length) console.log(`audit_cloudflare_secret_parity: NOTE — ${extra.length} extra live secret names are not in manifest.`);
console.log("Proof limit: name parity only. Secret values are write-only and were not read or printed.");
