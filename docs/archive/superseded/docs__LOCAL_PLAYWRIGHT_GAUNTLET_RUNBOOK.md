<!-- ARCHIVED: superseded by active runbooks / ledgers. See docs/archive/ARCHIVE_INDEX.md and docs/DOCS_CONSOLIDATION_MAP.md. -->

# Local Headed Playwright Gauntlet Runbook

Status: ACTIVE  
Purpose: Run browser E2E on the operator's Mac when the container cannot reliably run Chromium.

## What this does

The local gauntlet:

1. installs dependencies with `npm ci`
2. runs `npm run build:recoverable`
3. starts the local Next server when testing `http://127.0.0.1:3000`
4. runs all Playwright tests in headed mode
5. keeps running across specs instead of stopping at the first failure
6. captures Playwright HTML reports, screenshots, traces, videos, console/network data, and logs
7. zips diagnostics into one uploadable file

## Browser diagnostics policy

`playwright.config.ts` is configured for diagnostic recovery:

- `reporter`: list + HTML report
- `screenshot`: only on failure
- `trace`: retain on failure
- `video`: on first retry, unless `PLAYWRIGHT_DISABLE_VIDEO=1`
- `retries`: controlled by `PLAYWRIGHT_RETRIES`, defaulted to `1` by the local gauntlet script

## Option 1 — double-click

From Finder, double-click:

```text
Run Local Headed Playwright Gauntlet.command
```

macOS may ask for permission the first time. If blocked, right-click the file and choose Open.

## Option 2 — Terminal

From the repo root:

```bash
./scripts/run_local_headed_playwright_gauntlet.sh
```

## Test a deployed URL instead of local server

```bash
PLAYWRIGHT_BASE_URL="https://westpeek.live" ./scripts/run_local_headed_playwright_gauntlet.sh
```

When `PLAYWRIGHT_BASE_URL` is not `http://127.0.0.1:3000` or `http://localhost:3000`, the script does not start a local server.

## If tests fail

Do not copy/paste one failure at a time.

Upload the generated ZIP file, named like:

```text
local-playwright-gauntlet-YYYYMMDD_HHMMSS.zip
```

Then use this prompt:

```text
The local test run finished. I have uploaded the complete local Playwright gauntlet artifact containing playwright-report, test-results, screenshots, traces, videos, console/network evidence, and logs for all failures.

Please review all failing specs simultaneously and provide:
1. A bulleted diagnosis of why each test failed.
2. The smallest application-code fixes required.
3. The complete updated replacement code or a new full baseline ZIP, depending on scope.
```

## Do not do this casually

Do not run:

```bash
npm audit fix --force
```

This gauntlet is for diagnosis, not destructive dependency modernization.

## Local Runtime Store Behavior

The headed Playwright gauntlet starts a production-style `next start` server from a temporary ZIP unpack before deployment. To make protected producer, crew, sponsor, and client surfaces testable without real Supabase credentials, the runner sets these variables for the local test process only:

```bash
AGENCY_EVENT_OS_RUNTIME_STORE=file
ALLOW_FILE_RUNTIME_STORE_IN_PRODUCTION=true
AGENCY_EVENT_OS_RUNTIME_STORE_PATH=.runtime-data/local-playwright-runtime.json
```

This is not a trusted deploy posture. It is an explicit local E2E harness setting so the browser suite can test show-readiness and role journeys without mutating production data. Trusted deploy validation still forbids file runtime storage in production.
