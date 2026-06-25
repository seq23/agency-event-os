#!/usr/bin/env bash
source "$(dirname "$0")/common.sh"
[[ -f "$LOCAL" ]]||"$(dirname "$0")/restore.sh"
validate "$LOCAL"
[[ -x "$HOME/run_hallmark_audit.sh" ]]||fail "Hallmark runner missing"
[[ -n "${HALLMARK_BASE_URL:-}" ]]||fail "HALLMARK_BASE_URL required"
PLAYWRIGHT_STORAGE_STATE="$LOCAL" "$HOME/run_hallmark_audit.sh" "$ROOT" "$HALLMARK_BASE_URL"
