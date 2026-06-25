#!/usr/bin/env bash
source "$(dirname "$0")/common.sh"
[[ -f "$LOCAL" ]]||fail "local auth state missing"
validate "$LOCAL"
