#!/usr/bin/env node
const fs = require('fs');
const os = require('os');
const path = require('path');

const root = process.cwd();
const contractPath = path.join(root, '_env_contract.json');
const contract = JSON.parse(fs.readFileSync(contractPath, 'utf8'));
const local = contract.localEnvRestore || {};
const backupPath = process.env[local.plainEnvVar || 'AGENCY_EVENT_OS_ENV_LOCAL_PATH']
  || process.env[contract.legacyLocalBackupEnv || 'AGENCY_EVENT_OS_ENV_BACKUP']
  || process.env.AGENCY_EVENT_OS_ENV_BACKUP
  || path.join(os.homedir(), `${contract.repo || 'agency-event-os'}.env.local.backup`)
  || path.join(os.homedir(), 'agency-event-os.env.local.backup');
const targetPath = path.join(root, '.env.local');

if (!fs.existsSync(backupPath)) {
  console.error(`Missing private env backup: ${backupPath}`);
  console.error('Set AGENCY_EVENT_OS_ENV_BACKUP or AGENCY_EVENT_OS_ENV_LOCAL_PATH to the private backup path.');
  process.exit(1);
}

const content = fs.readFileSync(backupPath, 'utf8');
const required = [...new Set([...(contract.productCriticalEnv || []), ...(contract.requiredRuntimeEnv || [])])];
const missing = required.filter((key) => !new RegExp(`^${key}=\\S+`, 'm').test(content));
if (missing.length) {
  console.error(`Private env backup has blank/missing required values: ${missing.join(', ')}`);
  process.exit(1);
}

fs.writeFileSync(targetPath, content, { mode: 0o600 });
console.log('Synced .env.local from private backup.');
console.log('Values were not printed.');
