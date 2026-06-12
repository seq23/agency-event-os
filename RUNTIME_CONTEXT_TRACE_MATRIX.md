# Runtime Context Trace Matrix — agency-event-os

Status: ACTIVE
Date: 2026-06-11

## Purpose

This matrix prevents local/test/deployed/provider-context drift. Before debugging any browser, auth, provider, webhook, deploy, or postdeploy failure, compare the contexts below.

| Context | What must be compared | Required proof |
|---|---|---|
| Working tree static inspection | source files, matrix, docs, env examples | Tier 1 report |
| Manual local server | command, port, host, env source, runtime store | local log / browser proof |
| Playwright self-spawn server | webServer command, env overrides, reuseExistingServer behavior | Tier 2 headed/self-spawn report |
| Playwright test process | env visible to test signer/client, base URL, provider toggles | test report |
| Unit/integration process | env defaults and mocked provider mode | test output |
| Local `.env.local` | existence only; never values; compare keys and hashes if needed | env parity report |
| Env examples/registry | required/optional/local-only/public/server-only keys | env validator report |
| CI/GitHub Actions env | secret names, workflow status, build command | gh evidence |
| Cloudflare/deployed env | required secret names, runtime deploy target | platform audit/sync report |
| Deployed runtime | explicit deployed base URL, API status, auth behavior | postdeploy report |
| Postdeploy smoke target | never localhost for final tier | smoke report |
| Provider dashboard/runtime state | provider account, sandbox/prod mode, evidence IDs | provider evidence report |

## Critical final-tier rule

Tier 3 fails when required context is missing. Missing context is not a skip; it is BLOCKED/UNPROVEN until resolved.

## Required final-tier env/input names

- POSTDEPLOY_BASE_URL or SMOKE_BASE_URL
- PLAYWRIGHT_BASE_URL
- STREAMYARD_REAL_PROVIDER_SMOKE=1
- LIVEKIT_*
- SUPABASE_*
- DAILY_* / ZOOM_* when fallback lanes run
- RESEND_API_KEY when email proof runs
