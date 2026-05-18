# Database Migration Plan

## Current Status

The first schema draft exists at:

```txt
db/migrations/0001_initial_schema.sql
```

The first seed draft exists at:

```txt
db/seed/seed.sql
```

## Migration Order

1. Identity/profile foundation.
2. Agencies and agency members.
3. Clients and contacts.
4. Events.
5. Production tasks/milestones.
6. Run-of-show.
7. Assets and approvals.
8. Contractors/vendors.
9. Speakers/sponsors.
10. Video rooms.
11. Analytics and audit logs.
12. Notifications and role assignments.
13. RLS policies.

## Rule

Do not wire public routes to real data until RLS policies are reviewed.
