-- 0011_reports_and_exports.sql
-- Reports, report sections, exports, sponsor lead exports, and delivery records.

create table if not exists public.event_reports (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references public.agencies(id) on delete cascade,
  client_id uuid references public.clients(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  report_type text not null,
  title text not null,
  status text not null default 'draft',
  generated_at timestamptz,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.event_report_sections (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references public.agencies(id) on delete cascade,
  report_id uuid not null references public.event_reports(id) on delete cascade,
  section_key text not null,
  title text not null,
  summary text,
  metrics jsonb not null default '{}'::jsonb,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.event_report_exports (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references public.agencies(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  report_id uuid references public.event_reports(id) on delete cascade,
  export_type text not null,
  file_name text not null,
  status text not null default 'queued',
  asset_record_id uuid references public.asset_records(id) on delete set null,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create table if not exists public.sponsor_lead_exports (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references public.agencies(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  sponsor_id uuid references public.sponsors(id) on delete cascade,
  export_status text not null default 'queued',
  lead_count integer not null default 0,
  file_name text,
  asset_record_id uuid references public.asset_records(id) on delete set null,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

alter table public.event_reports enable row level security;
alter table public.event_report_sections enable row level security;
alter table public.event_report_exports enable row level security;
alter table public.sponsor_lead_exports enable row level security;
