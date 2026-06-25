#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const scanRoots = ["app", "lib", "services", "scripts", "tests"];
const ignoredDirs = new Set(["node_modules", ".next", ".git", "playwright-report", "test-results", "reports"]);
const failures = [];

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ignoredDirs.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (/\.(js|mjs|cjs|ts|tsx)$/.test(entry.name)) files.push(full);
  }
  return files;
}

function rel(file) { return path.relative(root, file); }

for (const scanRoot of scanRoots) {
  for (const file of walk(path.join(root, scanRoot))) {
    const text = fs.readFileSync(file, "utf8");
    const lines = text.split(/\r?\n/);
    const usesLivekitTwirp = text.includes("/twirp/livekit");
    if (!usesLivekitTwirp) continue;

    if (!/wss:\/\//.test(text) || !/https:\/\//.test(text)) {
      failures.push(`${rel(file)}: LiveKit Twirp caller must explicitly normalize wss:// -> https:// before fetch().`);
    }

    lines.forEach((line, index) => {
      const rawLivekitUrlSameLine = /LIVEKIT_URL|livekitUrl|input\.livekitUrl/.test(line) && /twirp\/livekit/.test(line);
      const normalizedSameLine = /normalizeLiveKitApiBaseUrl|livekitApiBaseUrl|apiBaseUrl/.test(line);
      if (rawLivekitUrlSameLine && !normalizedSameLine) {
        failures.push(`${rel(file)}:${index + 1}: raw LiveKit URL is used to build Twirp URL without normalization.`);
      }
      if (/Fetch API cannot load:\s*wss:\/\//.test(line)) {
        failures.push(`${rel(file)}:${index + 1}: validator/test must not encode stale wss:// Twirp failure as expected behavior.`);
      }
    });
  }
}

const service = path.join(root, "services", "video", "livekitIngressService.ts");
if (fs.existsSync(service)) {
  const text = fs.readFileSync(service, "utf8");
  if (!/export function normalizeLiveKitApiBaseUrl/.test(text)) {
    failures.push("services/video/livekitIngressService.ts: must export normalizeLiveKitApiBaseUrl for unit coverage.");
  }
}

const harness = path.join(root, "scripts", "tier4_controlled_rtmp_broadcaster_proof.mjs");
if (fs.existsSync(harness)) {
  const text = fs.readFileSync(harness, "utf8");
  for (const token of ["tier4DataTrace", "failureClass", "deployed_app_livekit_ingress_response", "harness_livekit_twirp_request"]) {
    if (!text.includes(token)) failures.push(`scripts/tier4_controlled_rtmp_broadcaster_proof.mjs: missing Tier 4 data trace token ${token}.`);
  }
}

if (failures.length) {
  console.error("validate_livekit_twirp_url_contract: FAIL");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("validate_livekit_twirp_url_contract: PASS");
