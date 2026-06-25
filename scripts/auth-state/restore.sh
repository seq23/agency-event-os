#!/usr/bin/env bash
source "$(dirname "$0")/common.sh"
command -v gpg>/dev/null||fail "gpg required"
[[ -f "$VAULT" ]]||fail "vault missing"
mkdir -p "$(dirname "$LOCAL")";tmp="$LOCAL.tmp.$$";trap 'rm -f "$tmp"' EXIT
gpg --quiet --decrypt --output "$tmp" "$VAULT"
validate "$tmp";chmod 600 "$tmp";mv "$tmp" "$LOCAL"
