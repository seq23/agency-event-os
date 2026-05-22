const fs = require('fs');
const path = require('path');

function repoRoot() {
  return path.resolve(__dirname, '..', '..');
}

function readRegistry() {
  const registryPath = path.join(repoRoot(), 'deployment', 'env-var-registry.json');
  return JSON.parse(fs.readFileSync(registryPath, 'utf8'));
}

function demoDefaults() {
  const registry = readRegistry();
  return registry.demoDefaults || {};
}

function day1Default(key, fallback = '') {
  return process.env[key] || demoDefaults()[key] || fallback;
}

function requiredDay1Default(key) {
  const value = day1Default(key);
  if (!value) throw new Error(`Missing day1 demoDefault for ${key}`);
  return value;
}

module.exports = {
  readRegistry,
  demoDefaults,
  day1Default,
  requiredDay1Default,
};
