-- 0005_testing_diagnostics_runs.sql
-- Phase 6 browser diagnostic run/result persistence.

create table if not exists public.testing_diagnostic_runs (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references public.agencies(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  profile_id uuid references public.profiles(id) on delete set null,
  participant_label text,
  readiness_status text not null default 'not_ready',
  readiness_score integer not null default 0,
  producer_summary text not null default '',
  user_agent text,
  created_at timestamptz not null default now()
);

create table if not exists public.testing_diagnostic_results (
  id uuid primary key default gen_random_uuid(),
  run_id uuid not null references public.testing_diagnostic_runs(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  diagnostic_type text not null,
  status text not null,
  severity text not null,
  summary text not null,
  recommended_action text not null,
  metadata jsonb not null default '{}'::jsonb,
  measured_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table public.testing_diagnostic_runs enable row level security;
alter table public.testing_diagnostic_results enable row level security;
