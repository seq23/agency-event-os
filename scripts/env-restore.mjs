#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const argv = process.argv.slice(2);
const args = new Set(argv.filter((arg) => !arg.startsWith('--vault=') && !arg.startsWith('--source=')));
const contractPath = path.join(root, '_env_contract.json');
const contract = JSON.parse(fs.readFileSync(contractPath, 'utf8'));
const target = path.join(root, '.env.local');

function expandHome(input) {
  if (!input) return null;
  if (input === '~') return os.homedir();
  if (input.startsWith('~/')) return path.join(os.homedir(), input.slice(2));
  return input;
}

function readArgValue(name) {
  const eq = argv.find((arg) => arg.startsWith(`${name}=`));
  if (eq) return eq.slice(name.length + 1);
  const index = argv.indexOf(name);
  if (index >= 0 && argv[index + 1]) return argv[index + 1];
  return null;
}

function unique(items) {
  return [...new Set(items.filter(Boolean))];
}

function candidateSources() {
  const local = contract.localEnvRestore || {};
  const gpgEnvVar = local.gpgEnvVar || 'AGENCY_EVENT_OS_ENV_GPG_PATH';
  const plainEnvVar = local.plainEnvVar || 'AGENCY_EVENT_OS_ENV_LOCAL_PATH';
  const legacyEnvVar = contract.legacyLocalBackupEnv || 'AGENCY_EVENT_OS_ENV_BACKUP';

  const explicitVault = readArgValue('--vault') || readArgValue('--source');
  const gpgCandidates = unique([
    explicitVault,
    process.env[gpgEnvVar],
    process.env.AGENCY_EVENT_OS_ENV_GPG_PATH,
    contract.encryptedVault ? path.join(root, contract.encryptedVault) : null,
    ...(local.encryptedVaultCandidates || []).map(expandHome),
    path.join(os.homedir(), '.config', contract.repo || 'agency-event-os', '.env.local.gpg'),
    path.join(os.homedir(), '.config', contract.repo || 'agency-event-os', `${contract.repo || 'agency-event-os'}.env.local.gpg`),
    path.join(os.homedir(), `${contract.repo || 'agency-event-os'}.env.local.gpg`),
    path.join(os.homedir(), 'agency-event-os.env.local.gpg')
  ]).map((file) => ({ type: 'gpg', file }));

  const plainCandidates = unique([
    process.env[plainEnvVar],
    process.env[legacyEnvVar],
    process.env.AGENCY_EVENT_OS_ENV_LOCAL_PATH,
    process.env.AGENCY_EVENT_OS_ENV_BACKUP,
    ...(local.plainEnvCandidates || []).map(expandHome),
    path.join(os.homedir(), `${contract.repo || 'agency-event-os'}.env.local.backup`),
    path.join(os.homedir(), 'agency-event-os.env.local.backup')
  ]).map((file) => ({ type: 'plain', file }));

  return [...gpgCandidates, ...plainCandidates].filter((source) => source.file);
}

function requiredKeys() {
  const critical = contract.productCriticalEnv || [];
  const runtime = contract.requiredRuntimeEnv || [];
  return unique([...critical, ...runtime]);
}

function validateEnvContent(content, sourceLabel) {
  const missing = requiredKeys().filter((key) => !new RegExp(`^${key}=\\S+`, 'm').test(content));
  if (missing.length) {
    throw new Error(`${sourceLabel} is missing required env values: ${missing.join(', ')}`);
  }
}

function decryptGpg(file) {
  const proc = spawnSync('gpg', ['--quiet', '--decrypt', file], { encoding: 'utf8' });
  if (proc.status !== 0) {
    throw new Error(`gpg decrypt failed for ${file}. ${proc.stderr || ''}`.trim());
  }
  return proc.stdout;
}

function restoreFromSource(source) {
  const absolute = path.isAbsolute(source.file) ? source.file : path.join(root, source.file);
  if (!fs.existsSync(absolute)) return null;
  const content = source.type === 'gpg' ? decryptGpg(absolute) : fs.readFileSync(absolute, 'utf8');
  validateEnvContent(content, `${source.type} env source ${absolute}`);
  fs.writeFileSync(target, content, { mode: 0o600 });
  return { ...source, file: absolute };
}

if (fs.existsSync(target) && !args.has('--overwrite')) {
  const backupDir = path.join(os.tmpdir(), `${contract.repo || 'repo'}-env-backups`);
  fs.mkdirSync(backupDir, { recursive: true });
  const backupPath = path.join(backupDir, `.env.local.${Date.now()}.bak`);
  fs.copyFileSync(target, backupPath);
  throw new Error(`.env.local already exists. Safe backup copied outside repo to ${backupPath}. Re-run with --overwrite if intentional.`);
}

const sources = candidateSources();
const attempted = [];
for (const source of sources) {
  const absolute = path.isAbsolute(source.file) ? source.file : path.join(root, source.file);
  attempted.push(`${source.type}:${absolute}`);
  try {
    const restored = restoreFromSource(source);
    if (restored) {
      console.log(`env-restore: restored .env.local from ${restored.type} source. Secret values were not printed.`);
      console.log(`env-restore: source path: ${restored.file}`);
      process.exit(0);
    }
  } catch (error) {
    throw error;
  }
}

console.error('env-restore: no approved private env source found.');
console.error('This is intentional: real secret vaults are not stored in baseline ZIP artifacts.');
console.error('Provide one of these local-only sources, then rerun:');
console.error('  AGENCY_EVENT_OS_ENV_GPG_PATH=/absolute/path/to/agency-event-os.env.local.gpg');
console.error('  AGENCY_EVENT_OS_ENV_LOCAL_PATH=/absolute/path/to/.env.local.backup');
console.error('  AGENCY_EVENT_OS_ENV_BACKUP=/absolute/path/to/.env.local.backup');
console.error('Default local-only locations checked:');
console.error('  ~/.config/agency-event-os/agency-event-os.env.local.gpg');
console.error('  ~/agency-event-os.env.local.gpg');
console.error('  ~/agency-event-os.env.local.backup');
console.error('Attempted sources:');
for (const item of attempted) console.error(`  - ${item}`);
process.exit(1);
