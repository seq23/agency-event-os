#!/bin/zsh
set -e
cd "$(dirname "$0")"
node scripts/run_local_e2e_diagnostics.js all
