# Artifact Manifest — agency-event-os

Artifact: `agency-event-os-main_BASELINE_06-11-26_zero-warning-validation-matrix.zip`
Repo: `agency-event-os`
Packaged root: repository root
Artifact type: full baseline snapshot ZIP
Status: STRUCTURALLY CHECKED — LOCAL TIER 2 VALIDATION REQUIRED

## Change summary

- Added explicit zero-advisory-noise validation contract to the repo validation matrix.
- Assigned every validation/test/smoke/audit/deploy package script to owner, tier/profile, severity, proof layer, and blocker policy through `_validator_admission_register.json`.
- Retired warning severities from `_repo_validation_matrix.json` and `_validator_admission_register.json`; active states are now `HARD FAIL` or `INFO / NO VALIDATION`.
- Simplified validator behavior so diagnostic checks do not block release by copy/label noise unless the matrix maps them to real product/security/deploy risk.
- Sanitized the Day 1 owner/operator packet, added the canonical `Owner / Boss Master Gate`, and removed raw owner/operator/crew password values from the committed packet.
- Updated docs consolidation policy with an active-doc simplification contract and no-sprawl rule.
- Restored reports service files required by typecheck/unit reports tests.
- Updated no-secrets validation to avoid generated-build false blockers and to route generated artifact cleanup through `validate:no-generated-artifacts`.

## Validation performed in sandbox

- Reopened ZIP successfully.
- Confirmed expected root files and patched files exist.
- Parsed `_repo_validation_matrix.json` and `_validator_admission_register.json` successfully.
- Confirmed no active repo warning strings remain outside ignored/generated folders.
- Ran and passed:
  - `npm run test:everything:tier1` — 13/13 passed before final packaging.
  - `npm run validate:v7`
  - `npm run validate:v5-no-secrets`
  - `npm run validate:brand`
  - `npm run validate:validator-admission`
  - `npm run validate:docs-consolidation`
  - `npm run validate:final-tier-contract`

## Validation not claimed

- Full Tier 2 with local env was not run in sandbox.
- Cloudflare/OpenNext build was not rerun in sandbox after this pass.
- Deployed Tier 3/provider proof was not run.

## Expected local sequence

After applying the ZIP locally, run:

```bash
NODE_OPTIONS="--max-old-space-size=3072" npm run test:everything:tier2:with-env
```

Then run Tier 3 only after deploy/base URL/provider credentials are available.
