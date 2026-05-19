-- 0012_pre_venue_hardening.sql
-- Pre-venue completion hardening: UI writeback support, diagnostic persistence, asset review, audit feed, report center.

create table if not exists public.diagnostic_incident_links (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references public.agencies(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  diagnostic_run_id uuid references public.testing_diagnostic_runs(id) on delete cascade,
  diagnostic_result_id uuid references public.testing_diagnostic_results(id) on delete cascade,
  incident_id uuid references public.incident_logs(id) on delete cascade,
  link_reason text not null default 'diagnostic_failure',
  created_at timestamptz not null default now()
);

create table if not exists public.asset_review_actions (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references public.agencies(id) on delete cascade,
  event_id uuid references public.events(id) on delete cascade,
  asset_record_id uuid not null references public.asset_records(id) on delete cascade,
  actor_profile_id uuid references public.profiles(id) on delete set null,
  action text not null,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.dashboard_activity_feed_items (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references public.agencies(id) on delete cascade,
  client_id uuid references public.clients(id) on delete set null,
  event_id uuid references public.events(id) on delete set null,
  source_type text not null,
  source_id uuid,
  title text not null,
  body text,
  visibility text not null default 'internal_agency',
  created_at timestamptz not null default now()
);

create table if not exists public.report_center_items (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references public.agencies(id) on delete cascade,
  client_id uuid references public.clients(id) on delete set null,
  event_id uuid references public.events(id) on delete cascade,
  report_id uuid references public.event_reports(id) on delete set null,
  label text not null,
  report_type text not null,
  status text not null default 'draft',
  last_generated_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.diagnostic_incident_links enable row level security;
alter table public.asset_review_actions enable row level security;
alter table public.dashboard_activity_feed_items enable row level security;
alter table public.report_center_items enable row level security;
