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
