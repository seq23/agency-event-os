# Batch 3B — Real Agency / Client / Event Persistence Foundation

## Purpose

Batch 3B adds Supabase-ready persistence boundaries for the first real business objects:

- agencies
- clients
- events
- profiles / memberships / roles through the existing Auth 3A layer

This phase intentionally does not wire full production workflow persistence yet.

## What Changed

- Real Supabase service boundaries for agency, client, and event reads.
- Create/update services for clients and events.
- Zod schemas for client/event payloads.
- Server actions for create/update flows.
- Audit hooks for create/update events.
- Seeded-backed UI form shells that show where create/edit UX will live.
- Mapping utilities between Supabase snake_case rows and app camelCase domain types.

## Scope Boundary

This batch does not persist assets, approvals, speaker/sponsor objects, reminders, email workflows, video rooms, or billing.

## Next Phase

After this batch is applied and validated, the next recommended batch is production workflow persistence: run-of-show, tasks, assets, approval requests, comments, speaker/sponsor records, and incident logs.
