import fs from "node:fs";
import path from "node:path";
import registry from '../../../deployment/env-var-registry.json';

const demoDefaults = registry.demoDefaults as Record<string, string | undefined>;

const localEnvCache = new Map<string, string>();
let localEnvLoaded = false;

function unquoteEnvValue(value: string) {
  return value.trim().replace(/^[\"']|[\"']$/g, "");
}

function loadLocalEnv() {
  if (localEnvLoaded) return;
  localEnvLoaded = true;
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#") || !line.includes("=")) continue;
    const index = line.indexOf("=");
    const key = line.slice(0, index).trim();
    const value = unquoteEnvValue(line.slice(index + 1));
    if (key) localEnvCache.set(key, value);
  }
}

function isPlaceholderEnvValue(value: string | undefined) {
  if (!value) return true;
  const normalized = value.trim();
  return !normalized || normalized === 'REPLACE_WITH_LOCAL_SECRET' || normalized === 'REPLACE_WITH_LOCAL_CODE' || normalized.startsWith('REPLACE_WITH_') || normalized === '<32+ character internal cookie secret>';
}

function localEnvValue(key: string) {
  loadLocalEnv();
  const value = localEnvCache.get(key);
  return isPlaceholderEnvValue(value) ? undefined : value;
}


export function day1Default(key: string, fallback = ''): string {
  const runtime = process.env[key];
  if (runtime && !isPlaceholderEnvValue(runtime)) return runtime;
  return localEnvValue(key) || demoDefaults[key] || fallback;
}

export function requiredDay1Default(key: string) {
  const value = day1Default(key);
  if (!value) throw new Error(`Missing day1 demoDefault for ${key}`);
  return value;
}

export const day1Passwords = [
  requiredDay1Default('OPERATOR_LAUNCHPAD_PASSWORD'),
  requiredDay1Default('CREW_ACCESS_PASSWORD'),
  requiredDay1Default('EVENT_DEMO_SPEAKER_CODE'),
  requiredDay1Default('EVENT_DEMO_SPONSOR_CODE'),
  requiredDay1Default('EVENT_DEMO_VIP_CODE'),
];
