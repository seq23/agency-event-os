# Technical Debt Register

## Current Known Shortcuts

| Area | Shortcut | Why Accepted | Future Fix |
|---|---|---|---|
| Auth | No production auth | MVP shell only | Add Supabase Auth |
| Persistence | Mock data only | Faster baseline | Add Supabase schema + queries |
| Video | Mock video placeholders | Avoid premature WebRTC complexity | Add provider abstraction implementation |
| Uploads | No real file storage | MVP shell only | Add Supabase Storage or S3 |
| Payments | No Stripe | Deferred commercial layer | Add pricing/ticketing/billing |
| Email | No transactional email | Shell only | Add Resend/Postmark workflows |
| Chat | No real chat persistence | Shell only | Add provider or Supabase realtime |
| Analytics | Mock analytics events | Demonstrates report model | Add event ingestion |
| Reports | No PDF export | Shell only | Add HTML/PDF export |
| Run-of-show | No drag/drop | Avoid UI complexity early | Add reorder + versioning |
| Contractors | No contractor payments | Deferred finance layer | Add invoice/payment workflows |
| Vendors | Vendor portal is shallow | MVP boundary | Add scoped vendor portal |
| Testing | Minimal unit tests only | Structural baseline | Add route smoke/E2E tests |
| Validation | No full build run here | Environment/time bounded | Run locally through updater/Codex |

| Testing Console | Testing console uses mock diagnostics | Lets operators see the intended cockpit now | Add real browser media tests and provider API checks |
