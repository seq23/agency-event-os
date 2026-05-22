import registry from '../../../deployment/env-var-registry.json';

const demoDefaults = registry.demoDefaults as Record<string, string | undefined>;

export function day1Default(key: string, fallback = '') {
  return process.env[key] || demoDefaults[key] || fallback;
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
