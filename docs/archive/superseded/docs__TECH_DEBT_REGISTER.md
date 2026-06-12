<!-- ARCHIVED: superseded by active runbooks / ledgers. See docs/archive/ARCHIVE_INDEX.md and docs/DOCS_CONSOLIDATION_MAP.md. -->

# Technical Debt Register

## Current Known Shortcuts

| Area | Shortcut | Why Accepted | Future Fix |
|---|---|---|---|
| Auth | No production auth | MVP shell only | Add Supabase Auth |
| Persistence | Seeded data only | Faster baseline | Add Supabase schema + queries |
| Video | Seeded video operational surfaces | Avoid premature WebRTC complexity | Add provider abstraction implementation |
| Uploads | No real file storage | MVP shell only | Add Supabase Storage or S3 |
| Payments | No Stripe | Post-MVP Scope commercial layer | Add pricing/ticketing/billing |
| Email | No transactional email | Shell only | Add Resend/Postmark workflows |
| Chat | No real chat persistence | Shell only | Add provider or Supabase realtime |
| Analytics | Seeded analytics events | Demonstrates report model | Add event ingestion |
| Reports | No PDF export | Shell only | Add HTML/PDF export |
| Run-of-show | No drag/drop | Avoid UI complexity early | Add reorder + versioning |
| Contractors | No contractor payments | Post-MVP Scope finance layer | Add invoice/payment workflows |
| Vendors | Vendor portal is shallow | MVP boundary | Add scoped vendor portal |
| Testing | Minimal unit tests only | Structural baseline | Add route smoke/E2E tests |
| Validation | No full build run here | Environment/time bounded | Run locally through updater/Codex |

| Testing Console | Testing console uses seeded diagnostics | Lets operators see the intended cockpit now | Add real browser media tests and provider API checks |


| Batch 3B persistence shells | Client/event forms define UX placement but do not submit from the browser yet | Avoids premature CRUD UX before route-specific create/edit screens | Wire form actions into dedicated create/edit pages after service layer is committed |


## Batch 3C — Production Ops Persistence

Adds Supabase-ready persistence for approvals, production inbox, last-minute change control, asset metadata, and audit hooks. Storage/email/video remain scheduled for later scope.
