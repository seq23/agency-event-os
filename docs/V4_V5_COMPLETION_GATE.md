# V4/V5 Completion Gate

The product is complete only when behavior exists, not merely files.

## Hard fail

- Missing named setup routes.
- Raw secrets or access codes in repo config or source.
- Weak cookie signing.
- Route or action privilege escalation.
- Duplicate migration number.
- Event config schema mismatch.
- Publishing workflow that cannot import a config package and create a real PR diff.
- Video ladder violation or automatic Zoom fallback.
- Runtime events that are display-only and not persisted.
- Smoke test that accepts broad non-500 responses.

## Strong warning

- File runtime store used without Supabase in a production-like environment.
- UX states are present but visually basic.
- Communications templates are configured but not customized for a client.
- Testing Console panel exists but does not perform live external API probes.

## Warning

- Copy polish.
- Accessibility refinements.
- Visual spacing.
- Future CSV/spreadsheet import adapters.
