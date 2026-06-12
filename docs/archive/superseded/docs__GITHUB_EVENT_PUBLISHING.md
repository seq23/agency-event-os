<!-- ARCHIVED: superseded by active runbooks / ledgers. See docs/archive/ARCHIVE_INDEX.md and docs/DOCS_CONSOLIDATION_MAP.md. -->

# GitHub Event Publishing

Publishing is GitHub Actions first, PR automation second, config package fallback third. The app must never direct-commit to main.

## Validation

This document is part of Master Plan v4 and is covered by v4 validators and smoke tests.


## V5 honesty rule
The canonical workflow is .github/workflows/publish-event-config.yml. It must refuse empty diffs and may only open a PR. No direct commit to main from the app or workflow.
