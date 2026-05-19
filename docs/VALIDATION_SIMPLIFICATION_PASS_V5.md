# West Peek Live — Validation Simplification Pass v5

## Policy

Validation should be strict where failure can break security, deployment, data integrity, or user trust. It should warn where the issue is quality, completeness, or pre-production readiness.

## Categories

### HARD FAIL
Blocks build/update. Used for compile errors, existing validator regressions, auth/security, hardcoded secrets, route authorization, publish/deploy claims, schema validity, critical smoke, and packaging hygiene.

### STRONG WARNING
Does not block local development snapshots, but blocks production launch or client-facing claims. Used for incomplete analytics, fallback operations, Testing Console coverage, docs/code mismatch, comms wiring, and UX state coverage.

### WARNING
Quality/debt signal only. Used for polish, accessibility improvements, visual refinement, duplicate docs, and non-claimed future feature support.

## Matrix

| Domain | Category | Check | Rule |
|---|---|---|---|
| Build/syntax/typecheck | HARD FAIL | npm run typecheck, npm run build, import/route compilation | Code that cannot compile or build is non-shippable. |
| Existing validator regression | HARD FAIL | npm run validate existing chain | New work cannot break old validators. Current v4 ZIP breaks brand, daily fallback, and white-label validators. |
| Packaging hygiene | HARD FAIL | ZIP manifest check | No .env.local, .open-next, .wrangler, node_modules, dist/build unless expected. |
| Auth cryptographic integrity | HARD FAIL | security validator + unit tests | Cookies must be HMAC-signed, non-forgeable, expiring, httpOnly/secure in prod. |
| No hardcoded production/demo access bypass | HARD FAIL | secret scanner + source validator | No [forbidden demo access literal] runtime bypass, no role demo codes in source, config stores env key names only. |
| Role/event route authorization | HARD FAIL | middleware tests | Special guest role must only reach its scoped portal/event; session auth must not bypass role checks. |
| Access audit logging | HARD FAIL | unit tests + audit service calls | Access success/failure must be logged without raw codes. |
| Event config schema validity | HARD FAIL | strict schema validator | Published event config must be complete, typed, cross-file consistent, no raw secrets. |
| Publish boundary | HARD FAIL | workflow validator | App cannot commit to main. Workflow must create non-empty PR/config package and fail if no diff. |
| Smoke critical routes | HARD FAIL | post-deploy smoke | /, /join, production access, protected redirects, video token routes, demo resolution must not 500. |
| Runtime-state boundary | HARD FAIL | validator | Repo config cannot be used as sole live state for incidents, fallbacks, analytics, access attempts. |
| Video provider ladder invariants | HARD FAIL | policy validator | LiveKit primary, Daily auto only, Zoom crew-confirmed, Google Meet manual last-resort. |
| UX state coverage for attendee/access/publish | STRONG WARNING | ux-state validator | Missing states should warn during draft, hard-fail before public launch. |
| Analytics instrumentation completeness | STRONG WARNING | coverage validator | Warn if not all required analytics events are emitted; hard-fail before post-event reporting sale. |
| Testing Console coverage | STRONG WARNING | console coverage validator | Warn if panels do not display front-door/access/publish/fallback/security checks. |
| Docs/runbooks consistency | STRONG WARNING | docs validator | Docs must not claim operational behavior that code lacks. |
| Communications wiring | STRONG WARNING | email workflow validator | Warn in MVP; hard-fail before using event reminders/invites commercially. |
| Accessibility/forms semantics | WARNING | a11y lint/manual | Labels, focus, errors, mobile polish; warning unless compliance requirement raised. |
| Visual polish/content tone | WARNING | manual QA | Copy and UI polish should not block structural/security fixes. |
| Import adapters / CSV support | WARNING | feature coverage | Useful but not MVP hard-fail unless setup wizard claims import support. |
