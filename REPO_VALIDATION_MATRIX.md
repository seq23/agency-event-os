# Validation Matrix — agency-event-os

---

## Master Addendum Validation Overlay — 2026-06-11

Machine-readable matrix: `_repo_validation_matrix.json`.

Canonical orchestrator:

```bash
npm run validate:everything
```

Tier 1 CI/static path:

```bash
npm run validate:everything -- --tier=1
```

Current container proof: Tier 1 validate:everything PASS in container after exact doc/secret/model fixes; build/Playwright/postdeploy/real StreamYard→LiveKit not run.

Postdeploy and live provider lanes are separate proof layers and must not be implied by local/static validation.


## Zero-Noise Validation Contract — 2026-06-12

This repo no longer uses advisory severities as release signals. Every validator is assigned into one of two operating states:

| State | Meaning | Release behavior |
|---|---|---|
| HARD FAIL | Real product, security, build, browser, provider, deploy, or governance risk | Blocks the selected tier/profile until fixed |
| INFO / NO VALIDATION | Diagnostic, trace, helper, or non-proof script | Does not block release; cannot be reported as a warning |

Every validation row must define: owner, tier, severity, proof layer, blocker policy, and simplification disposition. Random phrase-hunt checks are not allowed to block release unless the validation matrix maps the phrase to a real product/security/deploy risk.


## Tier 3 Prerequisite State — 2026-06-12

`BLOCKED UNTIL PREREQUISITE` is not an advisory warning and not a repo failure. It is a deterministic external-proof state used only when a selected validation lane requires a deployed URL, provider account, real credential, or operator-confirmed action that is not present in the command environment.

Rules:

- Missing deployed URL/provider/operator proof is reported as `BLOCKED`, not `FAIL`.
- Once prerequisites are supplied, the same validator becomes a hard blocker if the proof fails.
- Tier 3 cannot be called COMPLETE while any deployed/provider lane is blocked.
- Tier 1/Tier 2 remain local repo proof and must not imply deployed/provider proof.
