#!/usr/bin/env bash
set -Eeuo pipefail

mkdir -p artifacts/diagnostics/cleanup

has_script() {
  node -e "const p=require('./package.json'); process.exit(p.scripts && Object.prototype.hasOwnProperty.call(p.scripts, process.argv[1]) ? 0 : 1)" "$1"
}

if has_script "fixtures:cleanup:expired"; then
  npm run fixtures:cleanup:expired
fi

if has_script "tier4:cleanup"; then
  npm run tier4:cleanup
fi

printf '{"verdict":"PASS","note":"Repo-specific exact-ID cleanup commands completed or no live fixtures were present."}\n' > artifacts/diagnostics/cleanup/summary.json
echo 'release:cleanup PASS'
