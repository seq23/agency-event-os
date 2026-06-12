<!-- ARCHIVED: superseded by active runbooks / ledgers. See docs/archive/ARCHIVE_INDEX.md and docs/DOCS_CONSOLIDATION_MAP.md. -->

# V5 Integrity Repair

This pass fixes the v5 hard-fail and warning set without adding new product surface area.

## Fixed

- Canonical workflow is `.github/workflows/publish-event-config.yml`.
- Event config package import is performed by `scripts/import_event_config_package.js`.
- Workflow input is passed through `EVENT_CONFIG_PACKAGE`, allowlisted to `event-config-packages/`, and checked for shell/path abuse.
- Duplicate migration number was removed; v5 runtime tables live in `0019_v5_access_security_runtime_boundaries.sql`.
- Event join resolution is repo-config-authoritative for public event identity/state.
- Special guest destinations are config-template-driven, not hardcoded to one client.
- Route authorization parses event IDs by route segment; substring matching is forbidden.
- Access cookie behavior is covered by tamper/expiry/secret tests.
- Access, analytics, and fallback events persist to the runtime state store rather than repo config.
- Video fallback writes dedicated fallback runtime events instead of access audit events.
- Smoke test assertions are status/content-specific and no longer treat arbitrary non-500 responses as pass.

## Environment rule

Secrets remain outside the repo. `.env.example` is only the contract. Local `.env.local` can be restored after snapshot update from the operator's external backup file.
