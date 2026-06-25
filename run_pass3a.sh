#!/usr/bin/env bash
set -u
cd /mnt/data/gauntlet_3a
mkdir -p logs/gauntlet
{
  echo "START=$(date -u +%Y-%m-%dT%H:%M:%SZ)"
  echo "PWD=$(pwd)"
  echo "NODE=$(node -v 2>/dev/null || true)"
  echo "NPM=$(npm -v 2>/dev/null || true)"
} > logs/gauntlet/pass3a-env.log
npm ci --no-audit --no-fund --prefer-offline --progress=false > logs/gauntlet/npm-ci.log 2>&1
ci_status=$?
echo "$ci_status" > logs/gauntlet/npm-ci.exit
{
  echo "AFTER_NPM_CI=$(date -u +%Y-%m-%dT%H:%M:%SZ)"
  echo "npm_ci_exit=$ci_status"
  echo '=== node_modules exists ==='
  test -d node_modules && echo PASS || echo FAIL
  echo '=== node_modules/.bin exists ==='
  test -d node_modules/.bin && echo PASS || echo FAIL
  echo '=== NEXT BIN ==='
  ls -la node_modules/.bin/next 2>&1 || true
  echo '=== NEXT PACKAGE DIR ==='
  ls -la node_modules/next 2>&1 | head -40 || true
  echo '=== NEXT PACKAGE ==='
  node -e "const p=require('./node_modules/next/package.json'); console.log(p.name,p.version)" 2>&1 || true
  echo '=== BUILD SCRIPT ==='
  node -e "console.log(require('./package.json').scripts.build)" 2>&1 || true
  echo '=== NEXT RESOLVE ==='
  node -e "console.log(require.resolve('next/package.json'))" 2>&1 || true
  echo '=== BIN EXECUTABLE TEST ==='
  test -x node_modules/.bin/next && echo PASS || echo FAIL
} > logs/gauntlet/install-integrity.log 2>&1
if [[ "$ci_status" -eq 0 ]] && test -x node_modules/.bin/next && node -e "require('./node_modules/next/package.json')" >/dev/null 2>&1; then
  echo 0 > logs/gauntlet/install-integrity.exit
else
  echo 1 > logs/gauntlet/install-integrity.exit
fi
{
  echo "END=$(date -u +%Y-%m-%dT%H:%M:%SZ)"
  echo "install_integrity_exit=$(cat logs/gauntlet/install-integrity.exit)"
} >> logs/gauntlet/pass3a-env.log
