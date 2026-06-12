# Testing Sequence — agency-event-os

Status: ACTIVE
Date: 2026-06-11

## Tier 1 — Static/source

Run source-level validation only. Do not claim browser/deploy/provider proof.

```bash
npm run validate:final-tier-contract
npm run validate:everything -- --tier=1
```

## Tier 2 — Local runtime/browser

Run local build and browser/self-spawn proof. Do not claim deployed/provider proof.

```bash
npm run validate:everything -- --tier=2
```

If headed browser review is supported, run the repo's headed gauntlet command from `package.json`.

## Tier 3 — Final release gate / ultimate provider proof

Tier 3 must prove deployment plus every provider lane. It must use explicit deployed URLs and live provider evidence. If a provider lane cannot run, Tier 3 is BLOCKED/UNPROVEN and COMPLETE is forbidden.

```bash
npm run validate:everything -- --tier=3
```

Required inputs:

- POSTDEPLOY_BASE_URL or SMOKE_BASE_URL
- PLAYWRIGHT_BASE_URL
- STREAMYARD_REAL_PROVIDER_SMOKE=1
- LIVEKIT_*
- SUPABASE_*
- DAILY_* / ZOOM_* when fallback lanes run
- RESEND_API_KEY when email proof runs

## Failure handling

1. Classify the failure context.
2. Inspect logs/traces/provider evidence.
3. Compare runtime context parity.
4. Patch source of truth.
5. Rerun smallest proof.
6. Rerun Tier 3 before COMPLETE.
7. Clean generated artifacts.
8. Package full baseline ZIP and reopen it.

## Completion boundary

Tier 1 + Tier 2 without Tier 3 = PARTIAL.
Tier 3 with any provider lane unproven = BLOCKED/PARTIAL.
Tier 3 with all required provider lanes passed = eligible for COMPLETE, assuming artifact and GitHub/deploy evidence also pass.


## Aggregate failure-harvesting command

Use this command when the goal is to collect every failure before patching:

```bash
NODE_OPTIONS="--max-old-space-size=3072" npm run test:everything
```

The command writes one report and per-command logs under `logs/test-everything/<timestamp>/`. Do not call a repo COMPLETE from this command alone unless the final Tier 3 provider/deploy evidence also passes.

See `TERMINAL_RELEASE_RUNBOOK.md` for the full one-command-at-a-time release sequence.

---

## Temporary `.env.local` wrapper sequence

For any local command that needs provider secrets, run the `:with-env` variant. The wrapper restores `.env.local` from the repo-approved encrypted vault, runs the test command, and removes `.env.local` again when it created the file.

Predeploy local proof:

```bash
NODE_OPTIONS="--max-old-space-size=3072" npm run test:everything:tier2:with-env
```

Postdeploy/final provider proof:

```bash
POSTDEPLOY_BASE_URL="https://<fresh-deployment-url>" \
PLAYWRIGHT_BASE_URL="https://<fresh-deployment-url>" \
NODE_OPTIONS="--max-old-space-size=3072" \
npm run test:everything:tier3:with-env
```

Full failure harvest:

```bash
NODE_OPTIONS="--max-old-space-size=3072" npm run test:everything:with-env
```

The final Tier 3 command must fail or block if required deployed/provider proof inputs are absent. Do not mark COMPLETE from Tier 1/Tier 2 alone.

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

## Tier 3 deployed/provider prerequisite repair — 2026-06-11

Tier 3 validators now distinguish repo/app failures from unavailable external proof.

- Postdeploy checks require an explicit non-local deployed base URL (`POSTDEPLOY_BASE_URL`, `SMOKE_BASE_URL`, `PLAYWRIGHT_BASE_URL`, or `NEXT_PUBLIC_APP_URL`).
- Real StreamYard/LiveKit proof requires a deployed base URL plus operator acknowledgement env for the controlled real-provider test.
- Missing Tier 3 prerequisites are reported as `BLOCKED`, not as app failures or false passes.
- Once prerequisites are supplied, failed commands remain hard blockers.
