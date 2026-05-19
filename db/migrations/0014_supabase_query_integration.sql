-- 0014_supabase_query_integration.sql
-- Query integration support records.

create table if not exists public.query_integration_health_checks (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid references public.agencies(id) on delete set null,
  event_id uuid references public.events(id) on delete set null,
  surface text not null,
  status text not null default 'ok',
  details jsonb not null default '{}'::jsonb,
  checked_at timestamptz not null default now()
);

create table if not exists public.runtime_seed_fallback_events (
  id uuid primary key default gen_random_uuid(),
  surface text not null,
  reason text not null,
  created_at timestamptz not null default now()
);

alter table public.query_integration_health_checks enable row level security;
alter table public.runtime_seed_fallback_events enable row level security;
