# Testing Sequence — agency-event-os

Status: ACTIVE
Date: 2026-06-12

## Canonical release command map

Use this map before splitting into smaller commands. Split only when a grouped command fails and the failure must be isolated.

```bash
# PRE-DEPLOY SOURCE/REPO PROOF
npm run validate

# POST-DEPLOY TIER 3 LIVE-RUNTIME PROOF
POSTDEPLOY_BASE_URL="https://<fresh-deployment-url>" \
PLAYWRIGHT_BASE_URL="https://<fresh-deployment-url>" \
SMOKE_BASE_URL="https://<fresh-deployment-url>" \
npm run postdeploy:full

# TIER 4 AUTOMATED LIVE-PROVIDER PROOF
npm run env:run -- -- bash -lc 'set -a; . ./.env.local; set +a; POSTDEPLOY_BASE_URL="https://<fresh-deployment-url>" PLAYWRIGHT_BASE_URL="https://<fresh-deployment-url>" SMOKE_BASE_URL="https://<fresh-deployment-url>" TIER4_CONTROLLED_RTMP_BROADCASTER=1 TIER4_LIVE_PROVIDER_OPERATIONAL_PROOF=1 TIER4_RESEND_SEND_APPROVED=1 NODE_OPTIONS="--max-old-space-size=3072" npm run tier4:auto-controlled-livekit-proof'
```

Meaning:

- `npm run validate` is the pre-deploy Tier 1-3 source/repo gate: typecheck, lint, unit tests, hard validation, route/UX/operator rules, and deploy-parity/static runtime contracts.
- `npm run postdeploy:full` is the grouped Tier 3 deployed-safe gate: live smoke, click audit, role flow, video-provider audit, and deployed browser checks.
- `tier4:auto-controlled-livekit-proof` is the final live-provider gate: restores temporary env, uses controlled RTMP through the deployed LiveKit ingress path, creates redacted evidence, runs provider journey proof, and runs the final Tier 4 proof.

Do not run the older piecemeal postdeploy sequence unless `postdeploy:full` fails. Do not claim Tier 4 COMPLETE from `postdeploy:full`; Tier 4 requires provider proof.

## Tier 1 — Static/source

Run source-level validation only. Do not claim browser/deploy/provider proof.

```bash
npm run validate:final-tier-contract
npm run validate:tier4-contract
npm run validate:everything -- --tier=1
```

## Tier 2 — Local runtime/browser

Run local build and browser/self-spawn proof. Do not claim deployed/provider proof.

```bash
npm run validate:everything -- --tier=2
```

If headed browser review is supported, run the repo's headed gauntlet command from `package.json`.

## Tier 3 — Deployed postdeploy critical proof / safe provider boundary

Tier 3 must use explicit deployed URLs. It proves the deployed app survives public/access/venue/provider routes and fails safely without leaking secrets. It does not prove real live provider operations.

Primary grouped postdeploy command:

```bash
POSTDEPLOY_BASE_URL="https://<fresh-deployment-url>" \
PLAYWRIGHT_BASE_URL="https://<fresh-deployment-url>" \
SMOKE_BASE_URL="https://<fresh-deployment-url>" \
npm run postdeploy:full
```

Optional aggregate validator when harvesting all tiered failures:

```bash
POSTDEPLOY_BASE_URL="https://<fresh-deployment-url>" \
PLAYWRIGHT_BASE_URL="https://<fresh-deployment-url>" \
NODE_OPTIONS="--max-old-space-size=3072" \
npm run validate:everything -- --tier=3
```

Required inputs:

- POSTDEPLOY_BASE_URL or SMOKE_BASE_URL
- PLAYWRIGHT_BASE_URL or NEXT_PUBLIC_APP_URL

## Tier 4 — Final live-provider operational proof

Tier 4 must prove the real credential-dependent lanes that Tier 3 intentionally does not prove.

```bash
POSTDEPLOY_BASE_URL="https://<fresh-deployment-url>" \
PLAYWRIGHT_BASE_URL="https://<fresh-deployment-url>" \
TIER4_LIVE_PROVIDER_OPERATIONAL_PROOF=1 \
STREAMYARD_REAL_PROVIDER_SMOKE=1 \
STREAMYARD_OPERATOR_CONFIRMED_BROADCAST=1 \
TIER4_STREAMYARD_LIVE_EVIDENCE_PATH="reports/tier4/streamyard-livekit-evidence.json" \
NODE_OPTIONS="--max-old-space-size=3072" \
npm run validate:everything -- --tier=4
```


Automated controlled RTMP proof (no StreamYard UI required when ffmpeg is available):

```bash
npm run env:run -- -- bash -lc 'set -a; . ./.env.local; set +a; POSTDEPLOY_BASE_URL="https://<fresh-deployment-url>" PLAYWRIGHT_BASE_URL="https://<fresh-deployment-url>" SMOKE_BASE_URL="https://<fresh-deployment-url>" TIER4_CONTROLLED_RTMP_BROADCASTER=1 TIER4_LIVE_PROVIDER_OPERATIONAL_PROOF=1 TIER4_RESEND_SEND_APPROVED=1 NODE_OPTIONS="--max-old-space-size=3072" npm run tier4:auto-controlled-livekit-proof'
```

This lane creates/observes the deployed LiveKit ingress, pushes synthetic audio/video through the same RTMP ingest surface a StreamYard Custom RTMP destination uses, writes a redacted evidence JSON, runs the real provider journey probe, then runs the Tier 4 live-provider proof command. It uses `env:run` so `.env.local` is restored only for the command and removed afterward. It requires local ffmpeg (`TIER4_FFMPEG_BIN` may override the binary path). It does not store RTMP URLs, stream keys, API keys, bearer tokens, cookies, service-role keys, webhook secrets, or raw recipient PII.

Focused live-provider proof:

```bash
POSTDEPLOY_BASE_URL="https://<fresh-deployment-url>" \
PLAYWRIGHT_BASE_URL="https://<fresh-deployment-url>" \
TIER4_LIVE_PROVIDER_OPERATIONAL_PROOF=1 \
STREAMYARD_REAL_PROVIDER_SMOKE=1 \
STREAMYARD_OPERATOR_CONFIRMED_BROADCAST=1 \
TIER4_STREAMYARD_LIVE_EVIDENCE_PATH="reports/tier4/streamyard-livekit-evidence.json" \
NODE_OPTIONS="--max-old-space-size=3072" \
npm run tier4:live-provider-operational-proof
```

Required Tier 4 inputs:

- Deployed base URL
- TIER4_LIVE_PROVIDER_OPERATIONAL_PROOF=1
- STREAMYARD_REAL_PROVIDER_SMOKE=1
- STREAMYARD_OPERATOR_CONFIRMED_BROADCAST=1
- TIER4_STREAMYARD_LIVE_EVIDENCE_PATH
- LIVEKIT_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET, LIVEKIT_WEBHOOK_SECRET
- Supabase envs when production persistence lane is enabled
- Daily / Zoom / Resend envs when those lanes are enabled

## Failure handling

1. Classify the failure context.
2. Inspect logs/traces/provider evidence.
3. Compare runtime context parity.
4. Patch source of truth.
5. Rerun smallest proof.
6. Rerun Tier 3 for deployed-safe proof.
7. Rerun Tier 4 for final live-provider proof when COMPLETE is claimed.
8. Clean generated artifacts.
9. Package full baseline ZIP and reopen it.

## Completion boundary

Tier 1 + Tier 2 without Tier 3 = PARTIAL.
Tier 3 without Tier 4 = DEPLOYED SAFE POSTDEPLOY PROOF ONLY.
Tier 4 with any provider lane unproven = BLOCKED/PARTIAL.
Tier 4 with all required provider lanes passed = eligible for COMPLETE, assuming artifact and GitHub/deploy evidence also pass.

## Aggregate failure-harvesting command

Use this command when the goal is to collect every failure before patching:

```bash
NODE_OPTIONS="--max-old-space-size=3072" npm run test:everything
```

The command writes one report and per-command logs under `logs/test-everything/<timestamp>/`. Do not call a repo COMPLETE from this command alone unless the final Tier 4 provider/deploy evidence also passes.

See `TERMINAL_RELEASE_RUNBOOK.md` for the full one-command-at-a-time release sequence.

## Temporary `.env.local` wrapper sequence

For any local command that needs provider secrets, run the `:with-env` variant. The wrapper restores `.env.local` from the repo-approved encrypted vault, runs the test command, and removes `.env.local` again when it created the file.

Predeploy local proof:

```bash
NODE_OPTIONS="--max-old-space-size=3072" npm run test:everything:tier2:with-env
```

Postdeploy deployed-safe proof:

```bash
POSTDEPLOY_BASE_URL="https://<fresh-deployment-url>" \
PLAYWRIGHT_BASE_URL="https://<fresh-deployment-url>" \
NODE_OPTIONS="--max-old-space-size=3072" \
npm run test:everything:tier3:with-env
```

Final live-provider proof:

```bash
POSTDEPLOY_BASE_URL="https://<fresh-deployment-url>" \
PLAYWRIGHT_BASE_URL="https://<fresh-deployment-url>" \
TIER4_LIVE_PROVIDER_OPERATIONAL_PROOF=1 \
STREAMYARD_REAL_PROVIDER_SMOKE=1 \
STREAMYARD_OPERATOR_CONFIRMED_BROADCAST=1 \
TIER4_STREAMYARD_LIVE_EVIDENCE_PATH="reports/tier4/streamyard-livekit-evidence.json" \
NODE_OPTIONS="--max-old-space-size=3072" \
npm run test:everything:tier4:with-env
```

Full failure harvest:

```bash
NODE_OPTIONS="--max-old-space-size=3072" npm run test:everything:with-env
```

The final Tier 4 command must fail or block if required deployed/provider proof inputs are absent. Do not mark COMPLETE from Tier 1/Tier 2/Tier 3 alone.

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
