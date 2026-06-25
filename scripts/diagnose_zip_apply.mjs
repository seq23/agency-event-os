#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import process from 'process';

const repo = process.cwd();
const lockPath = path.join(repo, 'package-lock.json');
const pkgPath = path.join(repo, 'package.json');
const nvmrcPath = path.join(repo, '.nvmrc');
const npmrcPath = path.join(repo, '.npmrc');

function fail(message) {
  console.error(`FAIL: ${message}`);
  process.exitCode = 1;
}

function ok(message) {
  console.log(`OK: ${message}`);
}

console.log('Agency Event OS quick-apply diagnostics');
console.log(`repo: ${repo}`);
console.log(`node: ${process.version}`);

const major = Number(process.versions.node.split('.')[0]);
if (major === 22) ok('Node major is 22, matching Cloudflare/Wrangler lane.');
else fail(`Node major is ${major}; use Node 22 for this repo.`);

if (!fs.existsSync(pkgPath)) fail('package.json missing from current directory.');
else ok('package.json present.');

if (!fs.existsSync(lockPath)) fail('package-lock.json missing from current directory.');
else {
  const lockText = fs.readFileSync(lockPath, 'utf8');
  const internalMatches = lockText.match(/packages\.applied-caas-gateway1\.internal\.api\.openai\.org/g) || [];
  if (internalMatches.length) fail(`package-lock.json contains ${internalMatches.length} internal OpenAI/CAAS registry URLs; use the fixed ZIP or normalize lockfile before npm ci.`);
  else ok('package-lock.json contains no internal OpenAI/CAAS registry URLs.');

  let npmCount = 0;
  try {
    const lock = JSON.parse(lockText);
    for (const meta of Object.values(lock.packages || {})) {
      if (meta && typeof meta === 'object' && typeof meta.resolved === 'string' && meta.resolved.includes('registry.npmjs.org')) npmCount += 1;
    }
  } catch (error) {
    fail(`package-lock.json is not valid JSON: ${error.message}`);
  }
  console.log(`info: package-lock npmjs resolved entries: ${npmCount}`);
}

if (fs.existsSync(nvmrcPath)) ok(`.nvmrc present: ${fs.readFileSync(nvmrcPath, 'utf8').trim()}`);
else fail('.nvmrc missing; expected 22.');

if (fs.existsSync(npmrcPath)) ok('.npmrc present with registry/install guardrails.');
else fail('.npmrc missing; expected registry/install guardrails.');

if (process.exitCode) {
  console.error('RESULT: BLOCKED — fix diagnostics before running updater.');
} else {
  console.log('RESULT: READY — run the quick-apply updater command from QUICK_APPLY_ZIP_CHEAT_SHEET.md.');
}
