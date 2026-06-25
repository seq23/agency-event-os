#!/usr/bin/env node
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const argValue = (name, fallback) => {
  const exact = args.find((arg) => arg === `--${name}`);
  if (exact) return true;
  const prefixed = args.find((arg) => arg.startsWith(`--${name}=`));
  return prefixed ? prefixed.slice(name.length + 3) : fallback;
};
const tierArg = String(argValue('tier', 'all')).toLowerCase();
const dryRun = Boolean(argValue('dry-run', false));
const includeUnmatrixed = Boolean(argValue('include-unmatrixed', false));
const maxCommandMs = Number(argValue('max-command-ms', 20 * 60 * 1000));
const startedAt = new Date();
const stamp = startedAt.toISOString().replace(/[:.]/g, '-');
const root = process.cwd();
const logsDir = path.join(root, 'logs', 'test-everything', stamp);
fs.mkdirSync(logsDir, { recursive: true });

const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const pkg = readJson('package.json');
const scripts = pkg.scripts || {};
let matrix = {};
try { matrix = readJson('_repo_validation_matrix.json'); } catch {}

const rows = [];
if (Array.isArray(matrix)) rows.push(...matrix);
if (Array.isArray(matrix.validation)) rows.push(...matrix.validation);
if (Array.isArray(matrix.entries)) rows.push(...matrix.entries);
if (Array.isArray(matrix.validators)) rows.push(...matrix.validators);

const normalizeTier = (value) => {
  const text = String(value || '').toLowerCase().trim();
  if (!text) return 1;
  const match = text.match(/(?:tier\s*)?(\d+)/);
  return match ? Number(match[1]) : 1;
};
const requestedTier = tierArg === 'all' ? Infinity : Number(tierArg.replace(/[^0-9]/g, '')) || Infinity;
const shouldRunTier = (value) => normalizeTier(value) <= requestedTier;
const slug = (text) => String(text || 'task').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80) || 'task';
const excludedCommand = (command) => /run-test-everything-aggregate|test:everything|validate:everything|validate-everything\.mjs|run-test-operations-orchestrator\.mjs/.test(command);

const envValue = (name) => process.env[name] || '';
const anyEnvPresent = (names = []) => names.some((name) => Boolean(envValue(name)));
const allEnvPresent = (names = []) => names.every((name) => Boolean(envValue(name)));
const deployedBaseUrl = () => process.env.POSTDEPLOY_BASE_URL || process.env.SMOKE_BASE_URL || process.env.PLAYWRIGHT_BASE_URL || process.env.NEXT_PUBLIC_APP_URL || '';
const isExplicitDeployedBaseUrl = (value = deployedBaseUrl()) => /^https?:\/\//.test(value) && !/localhost|127\.0\.0\.1/.test(value);
const taskBlockReason = (task) => {
  if (task.requiresDeployedBaseUrl && !isExplicitDeployedBaseUrl()) {
    return 'requires explicit deployed base URL via POSTDEPLOY_BASE_URL, SMOKE_BASE_URL, PLAYWRIGHT_BASE_URL, or NEXT_PUBLIC_APP_URL';
  }
  if (Array.isArray(task.requiredEnvAny) && task.requiredEnvAny.length && !anyEnvPresent(task.requiredEnvAny)) {
    return `requires one of env vars: ${task.requiredEnvAny.join(', ')}`;
  }
  if (Array.isArray(task.requiredEnvAll) && task.requiredEnvAll.length && !allEnvPresent(task.requiredEnvAll)) {
    const missing = task.requiredEnvAll.filter((name) => !envValue(name));
    return `requires env vars: ${missing.join(', ')}`;
  }
  return '';
};

const tasks = [];
const seen = new Set();
for (const row of rows) {
  const scriptName = row.script || row.name || row.validator || row.id || '';
  const command = row.command || (row.script && scripts[row.script] ? `npm run ${row.script}` : '');
  if (!command || excludedCommand(command)) continue;
  if (!shouldRunTier(row.tier)) continue;
  const key = command;
  if (seen.has(key)) continue;
  seen.add(key);
  tasks.push({
    name: row.name || row.script || command,
    command,
    tier: row.tier || 'tier1-default',
    severity: row.severity || row.failureSeverity || 'UNSPECIFIED',
    category: row.category || 'uncategorized',
    proofLayer: row.proofLayer || row.proves || row.whatItProves || '',
    blockerPolicy: row.blockerPolicy || row.failureHandling || '',
    requiresDeployedBaseUrl: Boolean(row.requiresDeployedBaseUrl),
    requiredEnvAny: Array.isArray(row.requiredEnvAny) ? row.requiredEnvAny : [],
    requiredEnvAll: Array.isArray(row.requiredEnvAll) ? row.requiredEnvAll : [],
    source: '_repo_validation_matrix.json'
  });
}

if (includeUnmatrixed) {
  for (const [name, script] of Object.entries(scripts)) {
    if (!/^(test|validate|smoke|proof|gauntlet)(:|$)/.test(name)) continue;
    const command = `npm run ${name}`;
    if (excludedCommand(command) || seen.has(command)) continue;
    seen.add(command);
    tasks.push({ name: `UNMATRIXED ${name}`, command, tier: 'unmatrixed', severity: 'UNMATRIXED', category: 'unmatrixed', proofLayer: 'Package script included by --include-unmatrixed.', source: 'package.json' });
  }
}

tasks.sort((a, b) => normalizeTier(a.tier) - normalizeTier(b.tier) || a.name.localeCompare(b.name));

const run = (task, index) => new Promise((resolve) => {
  const logFile = path.join(logsDir, `${String(index + 1).padStart(3, '0')}-${slug(task.name)}.log`);
  const out = fs.createWriteStream(logFile, { flags: 'w' });
  const header = [
    `TASK ${index + 1}/${tasks.length}: ${task.name}`,
    `COMMAND: ${task.command}`,
    `TIER: ${task.tier}`,
    `SEVERITY: ${task.severity}`,
    `CATEGORY: ${task.category}`,
    `STARTED_AT: ${new Date().toISOString()}`,
    ''.padEnd(80, '=') + '\n'
  ].join('\n');
  out.write(header);
  process.stdout.write(`\n${header}`);
  const blockedReason = taskBlockReason(task);
  if (blockedReason) {
    const message = `BLOCKED — ${blockedReason}. This is unmet deploy/provider/operator evidence, not a repo execution failure.\n`;
    out.end(`\n${message}`);
    process.stdout.write(`\n${message}`);
    return resolve({ ...task, status: 'BLOCKED', exitCode: 2, logFile, durationMs: 0, blockedReason });
  }
  if (dryRun) {
    out.end('\nDRY RUN — command not executed.\n');
    return resolve({ ...task, status: 'DRY_RUN', exitCode: 0, logFile, durationMs: 0 });
  }
  const started = Date.now();
  const child = spawn(task.command, { shell: true, cwd: root, env: { ...process.env, NODE_OPTIONS: process.env.NODE_OPTIONS || '--max-old-space-size=3072' } });
  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    child.kill('SIGTERM');
  }, maxCommandMs);
  child.stdout.on('data', (chunk) => { out.write(chunk); process.stdout.write(chunk); });
  child.stderr.on('data', (chunk) => { out.write(chunk); process.stderr.write(chunk); });
  child.on('close', (code, signal) => {
    clearTimeout(timer);
    const durationMs = Date.now() - started;
    const footer = `\n${''.padEnd(80, '=')}\nFINISHED_AT: ${new Date().toISOString()}\nEXIT_CODE: ${code}\nSIGNAL: ${signal || ''}\nTIMED_OUT: ${timedOut}\nDURATION_MS: ${durationMs}\n`;
    out.end(footer);
    process.stdout.write(footer);
    resolve({ ...task, status: timedOut ? 'TIMEOUT' : code === 0 ? 'PASS' : code === 2 ? 'BLOCKED' : 'FAIL', exitCode: code ?? 1, signal, timedOut, logFile, durationMs, blockedReason: code === 2 ? 'command reported missing prerequisite' : undefined });
  });
});

const results = [];
for (let i = 0; i < tasks.length; i += 1) {
  // eslint-disable-next-line no-await-in-loop
  results.push(await run(tasks[i], i));
}

const endedAt = new Date();
const failed = results.filter((r) => r.status === 'FAIL' || r.status === 'TIMEOUT');
const blocked = results.filter((r) => r.status === 'BLOCKED');
const passed = results.filter((r) => r.status === 'PASS');
const report = {
  repo: pkg.name || path.basename(root),
  root,
  startedAt: startedAt.toISOString(),
  endedAt: endedAt.toISOString(),
  tier: tierArg,
  dryRun,
  total: results.length,
  passed: passed.length,
  failed: failed.length,
  blocked: blocked.length,
  logsDir,
  results: results.map((r) => ({ ...r, logFile: path.relative(root, r.logFile) }))
};
fs.writeFileSync(path.join(logsDir, 'test-everything-report.json'), JSON.stringify(report, null, 2));
const md = [
  `# Test Everything Report`,
  ``,
  `Repo: ${report.repo}`,
  `Started: ${report.startedAt}`,
  `Ended: ${report.endedAt}`,
  `Tier: ${tierArg}`,
  `Total tasks: ${report.total}`,
  `Passed: ${report.passed}`,
  `Failed/timeouts: ${report.failed}`,
  `Blocked prerequisites: ${report.blocked}`,
  `Logs directory: ${path.relative(root, logsDir)}`,
  ``,
  `## Failures`,
  failed.length ? failed.map((r) => `- **${r.name}** — ${r.status} exit=${r.exitCode}; log: \`${path.relative(root, r.logFile)}\``).join('\n') : 'None.',
  ``,
  `## All Results`,
  `| Status | Tier | Name | Command | Log |`,
  `|---|---|---|---|---|`,
  ...results.map((r) => `| ${r.status} | ${r.tier} | ${String(r.name).replace(/\|/g, '\\|')} | \`${String(r.command).replace(/\|/g, '\\|')}\` | \`${path.relative(root, r.logFile)}\` |`),
  ``
].join('\n');
fs.writeFileSync(path.join(logsDir, 'test-everything-report.md'), md);
console.log(`\nTEST EVERYTHING COMPLETE — ${passed.length}/${results.length} passed. Report: ${path.relative(root, path.join(logsDir, 'test-everything-report.md'))}`);
process.exit(failed.length ? 1 : 0);
