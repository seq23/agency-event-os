# Environment Variables — Agency Event OS

Status: ACTIVE
Date: 2026-06-11

Purpose: safe env contract for local, CI, Cloudflare Worker, postdeploy, and provider proof operations. This file records names and handling rules only. It must never contain real secret values.

## Secret handling law

- Real `.env`, `.env.local`, `.env.production`, backup env files, Cloudflare secret exports, API tokens, private keys, and provider credentials are forbidden in source artifacts.
- Local restoration must use `npm run env:restore`; cleanup must use `npm run env:remove`.
- Cloudflare/GitHub/provider values live in their platforms or owner vault, not this repo.
- Real StreamYard/LiveKit media proof requires operator confirmation and real provider credentials.

## Runtime env categories

### Required production / Cloudflare secrets

| Key | Handling |
|---|---|
| `AGENCY_EVENT_OS_RUNTIME_STORE` | Required production/Cloudflare secret or env value. |
| `ALLOW_FILE_RUNTIME_STORE_IN_PRODUCTION` | Required production/Cloudflare secret or env value. |
| `AUTH_SESSION_COOKIE_NAME` | Required production/Cloudflare secret or env value. |
| `BILLING_REQUIRED_FOR_SELF_SERVE` | Required production/Cloudflare secret or env value. |
| `CREW_ACCESS_PASSWORD` | Required production/Cloudflare secret or env value. |
| `DAILY_API_BASE_URL` | Required production/Cloudflare secret or env value. |
| `DAILY_API_KEY` | Required production/Cloudflare secret or env value. |
| `DAILY_DOMAIN` | Required production/Cloudflare secret or env value. |
| `DAILY_FALLBACK_ENABLED` | Required production/Cloudflare secret or env value. |
| `DAILY_STAGE_FALLBACK_REQUIRES_TOKEN` | Required production/Cloudflare secret or env value. |
| `EMAIL_FROM` | Required production/Cloudflare secret or env value. |
| `EMAIL_REPLY_TO` | Required production/Cloudflare secret or env value. |
| `EVENT_DEMO_CLIENT_CODE` | Required production/Cloudflare secret or env value. |
| `EVENT_DEMO_CREW_LITE_CODE` | Required production/Cloudflare secret or env value. |
| `EVENT_DEMO_SPEAKER_CODE` | Required production/Cloudflare secret or env value. |
| `EVENT_DEMO_SPONSOR_CODE` | Required production/Cloudflare secret or env value. |
| `EVENT_DEMO_VIP_CODE` | Required production/Cloudflare secret or env value. |
| `EVENT_LEADERSHIP_RESET_WEBINAR_CLIENT_CODE` | Required production/Cloudflare secret or env value. |
| `EVENT_LEADERSHIP_RESET_WEBINAR_CREW_LITE_CODE` | Required production/Cloudflare secret or env value. |
| `EVENT_LEADERSHIP_RESET_WEBINAR_SPEAKER_CODE` | Required production/Cloudflare secret or env value. |
| `EVENT_LEADERSHIP_RESET_WEBINAR_SPONSOR_CODE` | Required production/Cloudflare secret or env value. |
| `EVENT_LEADERSHIP_RESET_WEBINAR_VIP_CODE` | Required production/Cloudflare secret or env value. |
| `EVENT_PREMIUM_WORKSHOP_INTENSIVE_CLIENT_CODE` | Required production/Cloudflare secret or env value. |
| `EVENT_PREMIUM_WORKSHOP_INTENSIVE_CREW_LITE_CODE` | Required production/Cloudflare secret or env value. |
| `EVENT_PREMIUM_WORKSHOP_INTENSIVE_SPEAKER_CODE` | Required production/Cloudflare secret or env value. |
| `EVENT_PREMIUM_WORKSHOP_INTENSIVE_SPONSOR_CODE` | Required production/Cloudflare secret or env value. |
| `EVENT_PREMIUM_WORKSHOP_INTENSIVE_VIP_CODE` | Required production/Cloudflare secret or env value. |
| `EVENT_PROVIDER_INNOVATION_EXPO_CLIENT_CODE` | Required production/Cloudflare secret or env value. |
| `EVENT_PROVIDER_INNOVATION_EXPO_CREW_LITE_CODE` | Required production/Cloudflare secret or env value. |
| `EVENT_PROVIDER_INNOVATION_EXPO_SPEAKER_CODE` | Required production/Cloudflare secret or env value. |
| `EVENT_PROVIDER_INNOVATION_EXPO_SPONSOR_CODE` | Required production/Cloudflare secret or env value. |
| `EVENT_PROVIDER_INNOVATION_EXPO_VIP_CODE` | Required production/Cloudflare secret or env value. |
| `EVENT_SEED_DEMO_DAY_CLIENT_CODE` | Required production/Cloudflare secret or env value. |
| `EVENT_SEED_DEMO_DAY_CREW_LITE_CODE` | Required production/Cloudflare secret or env value. |
| `EVENT_SEED_DEMO_DAY_SPEAKER_CODE` | Required production/Cloudflare secret or env value. |
| `EVENT_SEED_DEMO_DAY_SPONSOR_CODE` | Required production/Cloudflare secret or env value. |
| `EVENT_SEED_DEMO_DAY_VIP_CODE` | Required production/Cloudflare secret or env value. |
| `LIVEKIT_API_KEY` | Required production/Cloudflare secret or env value. |
| `LIVEKIT_API_SECRET` | Required production/Cloudflare secret or env value. |
| `LIVEKIT_INGRESS_RTMP_BASE_URL` | Required production/Cloudflare secret or env value. |
| `LIVEKIT_URL` | Required production/Cloudflare secret or env value. |
| `LIVEKIT_WEBHOOK_SECRET` | Required production/Cloudflare secret or env value. |
| `NEXT_PUBLIC_APP_URL` | Required production/Cloudflare secret or env value. |
| `NEXT_PUBLIC_SELF_SERVE_ENABLED` | Required production/Cloudflare secret or env value. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Required production/Cloudflare secret or env value. |
| `NEXT_PUBLIC_SUPABASE_URL` | Required production/Cloudflare secret or env value. |
| `OPERATOR_LAUNCHPAD_PASSWORD` | Required production/Cloudflare secret or env value. |
| `OWNER_MASTER_ACCESS_PASSWORD` | Required production/Cloudflare secret or env value. |
| `RESEND_API_KEY` | Required production/Cloudflare secret or env value. |
| `SELF_SERVE_EVENT_CREATION_ENABLED` | Required production/Cloudflare secret or env value. |
| `STAGE_STREAM_DEFAULT_SOURCE` | Required production/Cloudflare secret or env value. |
| `STREAMYARD_PRIMARY_ENABLED` | Required production/Cloudflare secret or env value. |
| `SUPABASE_SERVICE_ROLE_KEY` | Required production/Cloudflare secret or env value. |
| `V5_ACCESS_COOKIE_SECRET` | Required production/Cloudflare secret or env value. |
| `V5_CREW_COOKIE_NAME` | Required production/Cloudflare secret or env value. |
| `V5_OPERATOR_COOKIE_NAME` | Required production/Cloudflare secret or env value. |
| `V5_OWNER_COOKIE_NAME` | Required production/Cloudflare secret or env value. |
| `V5_SPECIAL_GUEST_COOKIE_NAME` | Required production/Cloudflare secret or env value. |
| `VIDEO_PROVIDER` | Required production/Cloudflare secret or env value. |
| `ZOOM_MEETING_SDK_KEY` | Required production/Cloudflare secret or env value. |
| `ZOOM_MEETING_SDK_SECRET` | Required production/Cloudflare secret or env value. |

### Local-only / test controls

| Key | Handling |
|---|---|
| `AGENCY_EVENT_OS_ENV_BACKUP` | Local/test-only control. Do not configure as production runtime secret unless explicitly documented. |
| `E2E_CREW_PASSWORD` | Local/test-only control. Do not configure as production runtime secret unless explicitly documented. |
| `E2E_EVENT_CODE` | Local/test-only control. Do not configure as production runtime secret unless explicitly documented. |
| `E2E_OPERATOR_PASSWORD` | Local/test-only control. Do not configure as production runtime secret unless explicitly documented. |
| `E2E_OWNER_PASSWORD` | Local/test-only control. Do not configure as production runtime secret unless explicitly documented. |
| `E2E_SPEAKER_CODE` | Local/test-only control. Do not configure as production runtime secret unless explicitly documented. |
| `E2E_SPONSOR_CODE` | Local/test-only control. Do not configure as production runtime secret unless explicitly documented. |
| `E2E_VIP_CODE` | Local/test-only control. Do not configure as production runtime secret unless explicitly documented. |
| `LOCAL_PLAYWRIGHT_GAUNTLET_AUTH` | Local/test-only control. Do not configure as production runtime secret unless explicitly documented. |
| `NODE_OPTIONS` | Local/test-only control. Do not configure as production runtime secret unless explicitly documented. |
| `PLAYWRIGHT_BASE_URL` | Local/test-only control. Do not configure as production runtime secret unless explicitly documented. |
| `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` | Local/test-only control. Do not configure as production runtime secret unless explicitly documented. |
| `PLAYWRIGHT_DEPLOYED` | Local/test-only control. Do not configure as production runtime secret unless explicitly documented. |
| `PLAYWRIGHT_DISABLE_VIDEO` | Local/test-only control. Do not configure as production runtime secret unless explicitly documented. |
| `PLAYWRIGHT_HEADED` | Local/test-only control. Do not configure as production runtime secret unless explicitly documented. |
| `PLAYWRIGHT_LOCAL_E2E` | Local/test-only control. Do not configure as production runtime secret unless explicitly documented. |
| `PLAYWRIGHT_RETRIES` | Local/test-only control. Do not configure as production runtime secret unless explicitly documented. |
| `PLAYWRIGHT_SKIP_WEBSERVER` | Local/test-only control. Do not configure as production runtime secret unless explicitly documented. |
| `PORT` | Local/test-only control. Do not configure as production runtime secret unless explicitly documented. |
| `POSTDEPLOY_BASE_URL` | Local/test-only control. Do not configure as production runtime secret unless explicitly documented. |
| `SMOKE_BASE_URL` | Local/test-only control. Do not configure as production runtime secret unless explicitly documented. |
| `STREAMYARD_E2E_EVENT_ID` | Local/test-only control. Do not configure as production runtime secret unless explicitly documented. |
| `STREAMYARD_OPERATOR_CONFIRMED_BROADCAST` | Local/test-only control. Do not configure as production runtime secret unless explicitly documented. |
| `STREAMYARD_REAL_PROVIDER_SMOKE` | Local/test-only control. Do not configure as production runtime secret unless explicitly documented. |
| `VALIDATE_ENV_STRICT` | Local/test-only control. Do not configure as production runtime secret unless explicitly documented. |
| `WEST_PEEK_LIVE_PROVIDER_PROOF` | Local/test-only control. Do not configure as production runtime secret unless explicitly documented. |

### Optional development values

| Key | Handling |
|---|---|
| `AGENCY_EVENT_OS_RUNTIME_STORE_PATH` | Optional development/config helper. |
| `ALLOW_MOCK_VIDEO_PROVIDER_IN_PRODUCTION` | Optional development/config helper. |
| `CLOUDFLARE_PROJECT_NAME` | Optional development/config helper. |
| `CLOUDFLARE_WORKER_NAME` | Optional development/config helper. |
| `GITHUB_EVENT_CONFIG_OWNER` | Optional development/config helper. |
| `GITHUB_EVENT_CONFIG_REPO` | Optional development/config helper. |
| `GITHUB_EVENT_CONFIG_TOKEN` | Optional development/config helper. |
| `GITHUB_EVENT_CONFIG_WORKFLOW` | Optional development/config helper. |
| `GOOGLE_MEET_EMERGENCY_URL` | Optional development/config helper. |
| `NEXT_PUBLIC_ENABLE_ZOOM_EMBEDDED_FALLBACK` | Optional development/config helper. |
| `V4_ACCESS_COOKIE_SECRET` | Optional development/config helper. |
| `V4_CREW_COOKIE_NAME` | Optional development/config helper. |
| `V4_SPECIAL_GUEST_COOKIE_NAME` | Optional development/config helper. |
| `ZOOM_SDK_KEY` | Optional development/config helper. |
| `ZOOM_SDK_SECRET` | Optional development/config helper. |

## Proof commands

- `npm run validate:env` — static env contract validation.
- `npm run env:trace` — local/example/registry/Cloudflare manifest parity trace.
- `npm run env:restore` — restore local env from the canonical encrypted vault when available.
- `npm run env:remove` — remove/sanitize local env after live proof.
- `npm run cf:secrets:audit` — compare required secret names with Cloudflare/project manifests.
- `npm run cf:secrets:sync` — operator-facing sync helper; no secret values committed.

## Agency Event OS local env restore policy

Real secret values are intentionally not stored inside baseline ZIP artifacts. Use `npm run env:restore` or any `*:with-env` command to restore `.env.local` from an approved local-only private source. See `ENV_RESTORE_POLICY.md`.

Supported private source locations:

- `AGENCY_EVENT_OS_ENV_GPG_PATH=/absolute/path/to/agency-event-os.env.local.gpg`
- `AGENCY_EVENT_OS_ENV_LOCAL_PATH=/absolute/path/to/.env.local.backup`
- `AGENCY_EVENT_OS_ENV_BACKUP=/absolute/path/to/.env.local.backup`
- `~/.config/agency-event-os/agency-event-os.env.local.gpg`
- `~/agency-event-os.env.local.gpg`
- `~/agency-event-os.env.local.backup`

Do not commit `.env.local`.
