<!-- ARCHIVED: superseded by active runbooks / ledgers. See docs/archive/ARCHIVE_INDEX.md and docs/DOCS_CONSOLIDATION_MAP.md. -->

# Build Source Provenance

Artifact: `agency-event-os-main_BASELINE_05-20-26_05d2805_hostile2.zip`

Base ZIP supplied by user: `agency-event-os-main_BASELINE_05-20-26_05d2805.zip`

The source ZIP name indicates commit `05d2805`, but the archive does not include `.git` metadata. This artifact records source provenance by uploaded baseline name, not by local Git inspection.

Hostile review corrections included in this artifact:

- LiveKit Ingress credentials are no longer fabricated; the service calls LiveKit CreateIngress.
- Operator-only ingress/fallback/state endpoints require operator cookie access.
- Webhook verification fails closed and avoids Node crypto imports in app route code.
- StreamYard copy buttons are functional client controls.
- Breakout chat no longer uses fake seeded messages.
- Breakout video join now requests a LiveKit token and mounts the existing LiveKit room client.
- Supabase runtime snapshot reads the new stage stream, live chat, and attendee-live tables.
- Public StagePlayer does not mutate global fallback state directly.
- Daily stage token issuance is gated to active/switching Daily fallback state.
- Video token requests validate role authorization instead of trusting caller-provided role.
- Hardcoded demo attendee IDs were removed from attendee-facing permission controls.

Local validation is required after applying this ZIP.
