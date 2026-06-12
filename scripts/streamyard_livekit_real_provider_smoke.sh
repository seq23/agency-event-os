#!/usr/bin/env bash
set -euo pipefail

if [[ "${STREAMYARD_REAL_PROVIDER_SMOKE:-}" != "1" ]]; then
  echo "streamyard_livekit_real_provider_smoke: BLOCKED"
  echo "Set STREAMYARD_REAL_PROVIDER_SMOKE=1 to acknowledge this requires a real StreamYard Custom RTMP or controlled RTMP broadcaster test."
  exit 2
fi

BASE_URL="${POSTDEPLOY_BASE_URL:-${PLAYWRIGHT_BASE_URL:-}}"
if [[ -z "$BASE_URL" ]]; then
  echo "streamyard_livekit_real_provider_smoke: BLOCKED — set POSTDEPLOY_BASE_URL or PLAYWRIGHT_BASE_URL."
  exit 2
fi

missing=()
for key in LIVEKIT_URL LIVEKIT_API_KEY LIVEKIT_API_SECRET LIVEKIT_WEBHOOK_SECRET V5_ACCESS_COOKIE_SECRET; do
  if [[ -z "${!key:-}" ]]; then missing+=("$key"); fi
done
if [[ ${#missing[@]} -gt 0 ]]; then
  echo "streamyard_livekit_real_provider_smoke: BLOCKED — missing required env: ${missing[*]}"
  exit 2
fi

echo "This smoke does not prove media flow until a real StreamYard Custom RTMP broadcast or controlled RTMP test broadcaster sends video/audio into the generated LiveKit ingress."
echo "Base URL: $BASE_URL"

curl -fsS "$BASE_URL/" >/dev/null
npm run validate:day1-streamyard-model
npm run probe:streamyard-livekit:mock

cat <<'MANUAL'
Manual real-provider step:
1. Open the deployed Operator Launchpad / Testing Console.
2. Generate StreamYard → LiveKit ingress credentials.
3. Open StreamYard.
4. Choose Custom RTMP.
5. Paste generated RTMP URL.
6. Paste generated Stream Key.
7. Start a private test broadcast.
8. Confirm StreamYard shows live/connected and the app reports LiveKit ingress started / LIVEKIT_INGRESS_LIVE.
MANUAL

printf "Type YES_STREAMYARD_IS_LIVE after the real StreamYard broadcast is live: "
read -r confirmation
if [[ "$confirmation" != "YES_STREAMYARD_IS_LIVE" ]]; then
  echo "PARTIAL — app-side proof passed; real StreamYard broadcast was not confirmed."
  exit 3
fi

POSTDEPLOY_BASE_URL="$BASE_URL" PLAYWRIGHT_BASE_URL="$BASE_URL" PLAYWRIGHT_DEPLOYED=1 PLAYWRIGHT_SKIP_WEBSERVER=1 STREAMYARD_REAL_PROVIDER_SMOKE=1 npx playwright test tests/e2e/streamyard-producer-ingress.spec.ts

echo "PASS — real provider smoke completed with operator-confirmed StreamYard broadcast."
