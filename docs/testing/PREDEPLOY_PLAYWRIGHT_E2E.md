# Predeploy Playwright E2E — Local Headed Diagnostics Flow

This repo uses a deterministic local predeploy Playwright flow so the real repo is not updated or deployed before the ZIP has been browser-tested.

## Owner rule

Use the headed diagnostics runner before applying a new baseline ZIP to the real repo.

```bash
npm run test:e2e:predeploy
```

Or double-click:

```text
Run Headed Local E2E Diagnostics.command
```

## What this does

- Opens a visible Chromium browser by default.
- Starts the local Next.js dev server automatically through Playwright `webServer`.
- Uses `http://127.0.0.1:3000` unless `PLAYWRIGHT_BASE_URL` is explicitly set.
- Forces local file runtime storage.
- Blanks Supabase, LiveKit, Daily, and provider secrets for local predeploy tests.
- Uses mock video provider behavior.
- Runs with `--max-failures=0` so the run does not stop after the first failing test.
- Writes a diagnostics folder and diagnostics ZIP to `~/Downloads`.

## Diagnostics ZIP

Every run writes a ZIP like:

```text
~/Downloads/agency-event-os-e2e-diagnostics_YYYYMMDD_HHMMSS.zip
```

Upload that ZIP when tests fail. It includes:

- Playwright log output
- test-results traces/screenshots
- Playwright report output when available
- isolated runtime JSON snapshot
- summary metadata
- package/config files needed to reproduce the run

## Safe environment boundary

Local diagnostics are not allowed to depend on production Supabase, real provider secrets, or deployed Cloudflare configuration. The runner sets:

- `AGENCY_EVENT_OS_RUNTIME_STORE=file`
- `VIDEO_PROVIDER=mock`
- `public Supabase URL env var` is blanked
- `public Supabase anon env var` is blanked
- `Supabase service-role env var` is blanked
- `LiveKit provider env vars` are blanked
- `Daily provider env vars` are blanked
- `PLAYWRIGHT_LOCAL_E2E=1`
- `LOCAL_PLAYWRIGHT_GAUNTLET_AUTH=true`

Deployed checks remain separate and must be run with `PLAYWRIGHT_DEPLOYED=1` and `PLAYWRIGHT_SKIP_WEBSERVER=1`.

## Status language

A baseline ZIP is not deploy-ready until the headed local diagnostics runner has passed or its failures have been fixed and rerun.
