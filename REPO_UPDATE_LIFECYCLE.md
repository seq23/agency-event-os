# REPOSITORY UPDATE AND RELEASE LIFECYCLE

**Repo:** `agency-event-os`  
**Status:** ACTIVE / OPERATOR ENTRY POINT  
**Purpose:** Give a new chat or operator one authoritative map for applying a baseline ZIP and closing the release lifecycle.

## 1. Product lane

- Audit model: **public + authenticated + role-specific**.
- Source of truth: the approved baseline ZIP and repo-local `_repo_update_contract.json`.
- Terminal mode: one command at a time; Juniper interprets output and chooses the next command.

## 2. Update-time lifecycle

1. Confirm repo identity: `pwd`, Git root, repo name, remote, branch, and working tree.
2. Confirm ZIP identity, root structure, checksum, and snapshot mode.
3. Run updater preflight and create a rollback checkpoint.
4. Apply the ZIP with the contract-driven updater.
5. Restore local environment/auth state where applicable.
6. Run `npm run release:validate:container`.
7. Run `npm run release:self-heal`.
8. Run `npm run release:hallmark`. Hallmark is mandatory before deploy.
9. Run `npm run release:prepush`.
10. Commit, push, and verify GitHub Actions/deployment.
11. Run `npm run release:close-lifecycle`.

## 3. One-command lifecycle closure

`npm run release:close-lifecycle` executes this repo-specific sequence:

1. `npm run release:postpush`
2. `npm run postdeploy:full`
3. `npm run release:cleanup`
4. `npm run release:postpush`
5. `npm run release:report`

The orchestrator:

- writes logs and `summary.json` under `artifacts/diagnostics/lifecycle-close/<run-id>/`;
- uses one proof-run identifier across proof and cleanup;
- attempts exact cleanup even when a prior live-proof stage fails;
- does not run a post-cleanup audit unless cleanup passed;
- always attempts the final proof report;
- exits nonzero if any required stage fails.

Validate wiring without touching production:

`npm run release:close-lifecycle:dry-run`

## 4. Completion boundary

`release:close-lifecycle` is a deployed/live command. It requires the repo's real deployed URL, provider inputs, and session state where applicable. A dry run proves wiring only. `COMPLETE` still requires the generated final proof matrix to contain no unproven applicable lane.

## 5. Operator lookup

- Machine-readable lifecycle: `_repo_update_contract.json`
- Validator severity/admission: `_repo_validation_matrix.json`
- Documentation authority: `DOCUMENTATION_AUTHORITY_INDEX.md`
- Terminal commands: `TERMINAL_RELEASE_RUNBOOK.md`
- This lifecycle entry point: `REPO_UPDATE_LIFECYCLE.md`


## Canonical West Peek brand authority

- [`WEST_PEEK_BRAND_SYSTEM.md`](WEST_PEEK_BRAND_SYSTEM.md) — locked cross-suite visual system and Hallmark acceptance criteria.

## Pre-updater artifact gate

Before any baseline ZIP is applied, follow:

`docs/runbooks/PRE_UPDATER_BASELINE_CHECKLIST.md`

A failed required-file, secret, generated-artifact, ZIP-integrity, or root-layout check blocks updater execution.


## LOCKED SUITE LIFECYCLE ADDENDUM — 2026-06-14

See `docs/runbooks/SUITE_RELEASE_LIFECYCLE_CONTRACT.md`. The final artifact must pass `release:prepush` before delivery; the updater is a confirmation gate, not the first defect-discovery environment.


## v3.1 baseline naming

Use `npm run package:baseline:v3.1`. The canonical filename is `agency-event-os-main_BASELINE_MM-DD-YY_<sha8>.zip`, accompanied by `<filename>.sha256`. The SHA is the current Git commit when available; artifact-mode packaging falls back to a deterministic source-tree SHA.

## Cloudflare Worker workflow

`.github/workflows/deploy-cloudflare-worker.yml` is the bounded production deployment lane. It uses concurrency cancellation, a 45-minute job ceiling, bounded dependency/build/deploy/smoke commands, explicit credential gates, and deployable-output checks so a stuck OpenNext or Wrangler process cannot run indefinitely.
