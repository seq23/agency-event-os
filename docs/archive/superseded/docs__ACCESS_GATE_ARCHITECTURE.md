<!-- ARCHIVED: superseded by active runbooks / ledgers. See docs/archive/ARCHIVE_INDEX.md and docs/DOCS_CONSOLIDATION_MAP.md. -->

# Access Gate Architecture

Crew uses a shared high-trust password and signed cookie. Special guests use event code plus role-scoped code. Cookies are httpOnly, secure in production, sameSite=lax, event/role scoped, and audited.

## Validation

This document is part of Master Plan v4 and is covered by v4 validators and smoke tests.
