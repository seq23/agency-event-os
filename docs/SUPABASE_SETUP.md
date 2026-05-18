# Supabase Setup

## Current Status

Supabase is scaffolded but not yet wired into production CRUD.

This baseline includes:

- `lib/supabase/client.ts`
- `lib/supabase/server.ts`
- `lib/supabase/admin.ts`
- `db/migrations/0001_initial_schema.sql`
- `db/seed/seed.sql`

## Environment Variables

Add these to `.env.local`:

```txt
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

## Migration Status

`db/migrations/0001_initial_schema.sql` is a draft foundation migration. Review before production execution.

## Next Implementation Step

1. Create Supabase project.
2. Run/review migration in a dev database.
3. Apply seed data.
4. Replace mock reads module-by-module.
5. Add RLS policies before exposing external users.
