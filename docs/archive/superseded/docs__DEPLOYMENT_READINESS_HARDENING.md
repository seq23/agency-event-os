<!-- ARCHIVED: superseded by active runbooks / ledgers. See docs/archive/ARCHIVE_INDEX.md and docs/DOCS_CONSOLIDATION_MAP.md. -->

# Deployment Readiness Hardening

## Purpose

This document records the deploy-readiness hardening added after a successful deploy still exposed production readiness gaps during postdeploy validation.

## Incident class

The code built and deployed, but production was not fully ready because:

- Cloudflare secret audit did not compare live Worker secret names against the required manifest.
- Some postdeploy scripts silently skipped when only `PLAYWRIGHT_BASE_URL` was provided.
- Production Supabase schema was behind the deployed code.
- Runtime config gaps surfaced only after deployed browser tests hit real routes.

## Hardening added

- `audit_cloudflare_secret_parity.js` now checks live Cloudflare secret names via `wrangler secret list`.
- `validate_supabase_schema_parity.js` checks required production Supabase tables and columns.
- `validate_no_generated_artifacts.js` blocks deploy doctor runs when generated/runtime artifacts are present.
- `run_postdeploy_strict.js` resolves one base URL and prevents silent postdeploy skips.
- `deploy:doctor` runs validation, Cloudflare name parity, Supabase schema parity, and artifact hygiene.
- `deploy:production:safe` runs doctor, build, deploy, and strict postdeploy.

## Proof limits

Cloudflare secret values are write-only. The live audit proves required secret names exist. It does not read or print values.

Supabase schema parity proves required tables and columns are queryable through the configured Supabase project. It does not prove every business workflow.

Runtime readiness endpoint and public-route graceful fallback refactor remain separate future hardening work.

## Secret custody

Repo stores required names and validation rules.

Password manager stores actual secret values.

Cloudflare stores runtime copies.

Supabase stores production database state.

Local env backup is a working copy, not the sole source of truth.
