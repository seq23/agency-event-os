# Architectural Decisions — Agency Event OS

Status: ACTIVE  
Date: 2026-06-11

## Decision ID: ADM-2026-06-11-001
Date: 2026-06-11  
Status: Accepted

Context: Agency Event OS has many validators and phase docs, but needs a single Master Addendum validation surface.

Decision: `_repo_validation_matrix.json`, `_env_contract.json`, `REPO_PRODUCT_PROMISE_LEDGER.md`, and active runbooks govern future validation/deploy/env work. Legacy docs remain historical/supporting unless validators prove they can be archived.

Alternatives Considered: Continue adding phase docs; delete legacy docs immediately.

Reasoning: Immediate deletion risks breaking existing validators and losing source history. The active-doc index prevents new sprawl without destabilizing the repo.

Tradeoffs: Legacy docs remain physically present for now.

Risks Accepted: Some doc volume remains until validator-safe archival is run.

Validation Impact: `npm run validate:everything` becomes the canonical orchestrator.

Future Reversal Conditions: Once validators no longer reference legacy docs, move them to `docs/archive/` or remove duplicates.

## Decision ID: ADM-2026-06-11-002
Date: 2026-06-11  
Status: Accepted

Context: StreamYard and LiveKit cannot be honestly proven by static contract tests alone.

Decision: Real StreamYard Custom RTMP to LiveKit ingress proof is a separate Tier 3 provider lane and remains UNPROVEN until `npm run smoke:streamyard-livekit:real` runs against a deployed URL with real provider credentials and operator-confirmed private broadcast.

Alternatives Considered: Treat mock probe as sufficient; remove provider proof from completion.

Reasoning: Static/model tests prove app logic only, not real media flow.

Tradeoffs: Production readiness requires manual/provider coordination.

Risks Accepted: Local/CI may report partial readiness while live-media readiness remains blocked.

Validation Impact: Real provider lane is in `_repo_validation_matrix.json` and provider proof matrix.

Future Reversal Conditions: Replace manual StreamYard step with controlled RTMP broadcaster automation that proves media ingress without human confirmation.

### Decision ID: ADM-2026-06-13-SEC-01
* **Date:** 2026-06-13
* **Status:** Accepted
* **Context:** The Agency Event OS lockfile contained 10 high and 2 critical npm advisories, including production-reachable Next.js findings and critical/high development-tool chains.
* **Decision:** Upgrade Next.js to 15.5.18 with OpenNext 1.19.11, Playwright to 1.60.0, Vitest to 4.1.8, and force patched esbuild 0.28.1 through the nested toolchain. Migrate source code to Next 15 async cookies and route-prop contracts.
* **Alternatives Considered:** Stay on vulnerable Next 14; run `npm audit fix --force`; suppress audit findings; upgrade the entire toolchain indiscriminately.
* **Reasoning:** Targeted upgrades remove all high/critical findings while preserving controlled regression scope and avoiding unbounded package churn.
* **Tradeoffs:** Next 15 required broad but mechanical page/auth compatibility changes; nine lower-severity advisories remain.
* **Risks Accepted:** Deployed Cloudflare behavior and live provider behavior remain local-validation and postdeploy gates.
* **Validation Impact:** Tier 1 build, Tier 2 unit/integration, local OpenNext bundle, then Tier 3/4 post-update proof.
* **Future Reversal Conditions:** Reconsider versions only if Cloudflare deployment or authenticated browser proof identifies a concrete incompatibility.
