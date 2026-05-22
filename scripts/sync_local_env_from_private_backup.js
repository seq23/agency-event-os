#!/usr/bin/env node
const fs = require('fs');
const os = require('os');
const path = require('path');

const backupPath = path.join(os.homedir(), 'agency-event-os.env.local.backup');
const targetPath = path.join(process.cwd(), '.env.local');

if (!fs.existsSync(backupPath)) {
  console.error(`Missing private env backup: ${backupPath}`);
  process.exit(1);
}

const content = fs.readFileSync(backupPath, 'utf8');
const required = [
  'OWNER_MASTER_ACCESS_PASSWORD',
  'OPERATOR_LAUNCHPAD_PASSWORD',
  'CREW_ACCESS_PASSWORD',
  'V5_ACCESS_COOKIE_SECRET',
];
const missing = required.filter((key) => !new RegExp(`^${key}=\\S+`, 'm').test(content));
if (missing.length) {
  console.error(`Private env backup has blank/missing required values: ${missing.join(', ')}`);
  process.exit(1);
}

fs.writeFileSync(targetPath, content);
console.log('Synced .env.local from private backup.');
console.log('Values were not printed.');
