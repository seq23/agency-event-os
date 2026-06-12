<!-- ARCHIVED: superseded by active runbooks / ledgers. See docs/archive/ARCHIVE_INDEX.md and docs/DOCS_CONSOLIDATION_MAP.md. -->

# Auth Route Access Matrix

| Route family | Session required | Primary capability |
| --- | --- | --- |
| `/app/*` | Yes | `agency.view_dashboard` |
| `/client/*` | Yes | `client.view_portal` |
| `/crew/*` | Yes | `contractor.view_own_assignments` |
| `/speaker/*` | Yes | `speaker.view_own_portal` |
| `/sponsor/*` | Yes | `sponsor.view_own_booth` |
| `/venue/*` | Not yet | public/attendee venue access remains modeled, not locked |

Middleware checks for session presence. Server utilities handle actual permission resolution.
