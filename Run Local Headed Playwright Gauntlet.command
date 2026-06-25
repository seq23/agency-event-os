#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
./scripts/run_local_headed_playwright_gauntlet.sh
read -r -p "Press Enter to close this window..." _
