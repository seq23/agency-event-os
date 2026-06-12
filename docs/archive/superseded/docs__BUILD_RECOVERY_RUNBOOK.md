<!-- ARCHIVED: superseded by active runbooks / ledgers. See docs/archive/ARCHIVE_INDEX.md and docs/DOCS_CONSOLIDATION_MAP.md. -->

# Build Recovery Runbook

Status: Active
Audience: Owner + Day-0 Operator
Scope: West Peek Live build/container failures, especially cases where compile progresses but the final build result is not recoverable before timeout or container death.

## Purpose

A build that reaches compile or page-data collection can still be lost if the shell, container, or packaging step dies before output is captured. This runbook makes the build recoverable by separating source packaging, install, build, log capture, and final artifact packaging.

## Rule

Do not throw away a working tree because a container timed out after compile.

When the build result is unclear:

1. Preserve the current repo state.
2. Capture logs.
3. Probe output folders.
4. Package a recoverable baseline even if validation is partial.
5. Continue from the checkpoint instead of relying on a stranded working copy.

## Supported Scripts

Use these package scripts from the repo root:

```text
npm run build:recoverable
npm run cf:build:recoverable
npm run prezip:agency-event-os:recoverable
```

These scripts run the underlying build commands with:

- `NODE_OPTIONS=--max-old-space-size=4096` unless already supplied
- clean output folders before build
- tee-style log capture into `logs/build-recovery/`
- output folder probes for `dist`, `build`, `.next`, `out`, and `.open-next`

## Local Recovery Sequence

From a fresh repo root after the baseline ZIP is applied locally:

```bash
npm ci
npm run validate
npm run build:recoverable
npm run cf:build:recoverable
```

If a build fails or the terminal dies, check:

```bash
ls -la logs/build-recovery
ls -la dist build .next out .open-next 2>/dev/null
```

Then inspect the final log:

```bash
tail -80 logs/build-recovery/*.log
```

## Memory Escalation

The default recoverable script uses 4096 MB. If the machine has enough RAM and the log shows memory pressure, run:

```bash
NODE_OPTIONS="--max-old-space-size=8192" npm run build:recoverable
```

For Cloudflare/OpenNext build:

```bash
NODE_OPTIONS="--max-old-space-size=8192" npm run cf:build:recoverable
```

## Interpreting Results

### If the log shows a real stack trace

Fix the application error. Do not classify it as a container issue.

### If the log says `Killed`

Treat it as likely memory pressure. Retry with higher `NODE_OPTIONS` on a machine with enough RAM.

### If compile succeeds but the shell dies before final status

Do not rerun blindly. First check output folders and logs. If the repo state contains important work, package a recoverable baseline before more debugging.

### If `.next` or `.open-next` exists after a successful build

Those are generated outputs and must not be included in the source baseline ZIP unless a specific updater contract requires them. Clean them before source validation and packaging.

## Packaging Rule

Packaging must not depend on the same unstable long-running build session.

Correct order:

1. Source changes complete.
2. Package baseline checkpoint if work would otherwise be lost.
3. Fresh unpack.
4. `npm ci`.
5. Recoverable build with logs.
6. Clean generated outputs from the source snapshot.
7. Package final baseline ZIP.
8. Reopen ZIP and structurally check it.

## Status Labels

Use `COMPLETE` only when the final baseline ZIP is packaged, reopened, and requested validation passed.

Use `PARTIAL` when the ZIP is usable and preserves work, but build, Cloudflare build, browser E2E, or local updater validation remains incomplete.

Use `STRUCTURALLY CHECKED — LOCAL VALIDATION REQUIRED` when the ZIP is packaged and structurally sane but the local updater still needs to validate on the owner machine.

## Non-Negotiable

Never end a repo execution pass with valuable source changes stranded only in a working folder. Package a baseline checkpoint first, then keep debugging.
