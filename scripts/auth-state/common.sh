#!/usr/bin/env bash
set -Eeuo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.."&&pwd -P)"
LOCAL="${AUTH_STATE_LOCAL_PATH:-$ROOT/.auth/playwright-storage-state.json}"
VAULT="${AUTH_STATE_VAULT_PATH:-$HOME/AI_AUTH_VAULTS/agency-event-os/playwright-storage-state.json.gpg}"
fail(){ echo "ERROR: $*" >&2; exit 1;}
validate(){ EXPECTED_COOKIE="${AUTH_STATE_EXPECTED_COOKIE:-agency_event_os_session}" node - "$1" <<'NODE'
const fs=require('node:fs');let v;try{v=JSON.parse(fs.readFileSync(process.argv[2],'utf8'))}catch{process.exit(1)}if(!Array.isArray(v.cookies)||!Array.isArray(v.origins))process.exit(1);if(!v.cookies.find(x=>x.name===process.env.EXPECTED_COOKIE&&x.value))process.exit(1);console.log('auth state valid; values not printed');
NODE
}
