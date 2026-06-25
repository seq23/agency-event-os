#!/usr/bin/env bash
source "$(dirname "$0")/common.sh"
command -v gpg>/dev/null||fail "gpg required"
[[ -f "$LOCAL" ]]||fail "local auth state missing"
validate "$LOCAL";mkdir -p "$(dirname "$VAULT")";tmp="$VAULT.tmp.$$";trap 'rm -f "$tmp"' EXIT
gpg --symmetric --cipher-algo AES256 --output "$tmp" "$LOCAL";gpg --quiet --decrypt "$tmp">/dev/null;chmod 600 "$tmp";mv "$tmp" "$VAULT"
