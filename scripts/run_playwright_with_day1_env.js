#!/usr/bin/env node
const { spawnSync } = require('node:child_process');
const path = require('node:path');
const { day1Default } = require('./lib/day1AccessDefaults');

const root = process.cwd();
const cli = path.join(root, 'node_modules', '@playwright', 'test', 'cli.js');
const args = process.argv.slice(2);

const env = {
  ...process.env,
  OWNER_MASTER_ACCESS_PASSWORD: day1Default('OWNER_MASTER_ACCESS_PASSWORD'),
  OPERATOR_LAUNCHPAD_PASSWORD: day1Default('OPERATOR_LAUNCHPAD_PASSWORD'),
  CREW_ACCESS_PASSWORD: day1Default('CREW_ACCESS_PASSWORD'),
  E2E_OWNER_PASSWORD: day1Default('E2E_OWNER_PASSWORD') || day1Default('OWNER_MASTER_ACCESS_PASSWORD'),
  E2E_OPERATOR_PASSWORD: day1Default('E2E_OPERATOR_PASSWORD') || day1Default('OPERATOR_LAUNCHPAD_PASSWORD'),
  E2E_CREW_PASSWORD: day1Default('E2E_CREW_PASSWORD') || day1Default('CREW_ACCESS_PASSWORD'),
  E2E_SPEAKER_CODE: day1Default('E2E_SPEAKER_CODE') || day1Default('EVENT_DEMO_SPEAKER_CODE'),
  E2E_SPONSOR_CODE: day1Default('E2E_SPONSOR_CODE') || day1Default('EVENT_DEMO_SPONSOR_CODE'),
  E2E_VIP_CODE: day1Default('E2E_VIP_CODE') || day1Default('EVENT_DEMO_VIP_CODE'),
  EVENT_DEMO_CLIENT_CODE: day1Default('EVENT_DEMO_CLIENT_CODE'),
  EVENT_DEMO_CREW_LITE_CODE: day1Default('EVENT_DEMO_CREW_LITE_CODE'),
  EVENT_DEMO_SPEAKER_CODE: day1Default('EVENT_DEMO_SPEAKER_CODE'),
  EVENT_DEMO_SPONSOR_CODE: day1Default('EVENT_DEMO_SPONSOR_CODE'),
  EVENT_DEMO_VIP_CODE: day1Default('EVENT_DEMO_VIP_CODE'),
  V5_ACCESS_COOKIE_SECRET: process.env.V5_ACCESS_COOKIE_SECRET || 'local-playwright-gauntlet-cookie-secret-1234567890',
  V5_OWNER_COOKIE_NAME: process.env.V5_OWNER_COOKIE_NAME || day1Default('V5_OWNER_COOKIE_NAME', 'wpl_owner_access'),
  LIVEKIT_WEBHOOK_SECRET: process.env.LIVEKIT_WEBHOOK_SECRET || 'local-playwright-livekit-webhook-secret-1234567890',
};

const result = spawnSync(process.execPath, [cli, 'test', ...args], {
  cwd: root,
  env,
  stdio: 'inherit',
});

process.exit(result.status || 0);
