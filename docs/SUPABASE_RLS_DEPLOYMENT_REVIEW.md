# Supabase RLS Deployment Review — West Peek Live!

## Status

This document closes the Phase 17D SEV-2 audit finding that some public tables did not explicitly show row-level-security coverage in the static audit.

## Deployment rule

Before production deployment:

1. Confirm every application-owned table in `public` has RLS enabled.
2. Confirm public browser code only uses anon-safe paths.
3. Confirm service-role operations stay server-side.
4. Confirm tables used only by backend/admin services are not exposed directly to client components.

## Application-owned tables

The migration set creates the West Peek Live! operational schema from `0001` through `0017`.

Critical production tables include:

- agencies
- profiles
- clients
- events
- event_assets
- approvals
- change_requests
- production_workflow_runs
- browser_diagnostic_runs
- video_rooms
- livekit_room_sessions
- venue_sessions
- venue_breakouts
- venue_sponsor_booths
- speed_networking_rounds
- event_reports
- live_production_states
- replay_recordings
- email_send_logs
- email_delivery_attempts
- email_workflow_statuses

## Hard deployment check

Run this in Supabase SQL editor before production deployment:

```sql
select
  schemaname,
  tablename,
  rowsecurity
from pg_tables
where schemaname = 'public'
order by tablename;
```

Expected result:

- application-owned tables should show `rowsecurity = true`
- intentional exceptions must be documented before public launch

## Current app behavior

West Peek Live! keeps service-role access server-side through Supabase admin helpers. Browser/client surfaces should not import service-role helpers or secrets.

## Fix policy

If any application-owned table shows `rowsecurity = false`, run:

```sql
alter table public.<table_name> enable row level security;
```

Then add or confirm policies appropriate to the table's access model.
