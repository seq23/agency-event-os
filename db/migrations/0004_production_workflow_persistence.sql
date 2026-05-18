-- 0004_production_workflow_persistence.sql
-- Run-of-show, tasks, crew/vendor/contractor assignments, incidents, testing, backup rooms.

create table if not exists public.run_of_show_segments (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references public.agencies(id) on delete cascade,
  client_id uuid references public.clients(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  sort_order integer not null default 0,
  title text not null,
  public_title text not null,
  description text,
  start_at timestamptz,
  end_at timestamptz,
  duration_minutes integer not null default 0,
  room_label text,
  readiness_status text not null default 'not_ready',
  live_status text not null default 'scheduled',
  producer_notes text,
  technical_cues text,
  backup_plan text,
  actual_start_at timestamptz,
  actual_end_at timestamptz,
  delay_minutes integer not null default 0,
  owner_profile_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.run_of_show_segments add column if not exists title text;
alter table public.run_of_show_segments add column if not exists description text;
alter table public.run_of_show_segments add column if not exists room_label text;
alter table public.run_of_show_segments add column if not exists live_status text not null default 'scheduled';
alter table public.run_of_show_segments add column if not exists actual_start_at timestamptz;
alter table public.run_of_show_segments add column if not exists actual_end_at timestamptz;
alter table public.run_of_show_segments add column if not exists delay_minutes integer not null default 0;
alter table public.run_of_show_segments add column if not exists owner_profile_id uuid references public.profiles(id) on delete set null;

create table if not exists public.production_tasks (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references public.agencies(id) on delete cascade,
  client_id uuid references public.clients(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  run_of_show_segment_id uuid references public.run_of_show_segments(id) on delete set null,
  title text not null,
  description text,
  status text not null default 'todo',
  priority text not null default 'medium',
  due_at timestamptz,
  assigned_profile_id uuid references public.profiles(id) on delete set null,
  blocking_event_readiness boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.event_milestones (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references public.agencies(id) on delete cascade,
  client_id uuid references public.clients(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  title text not null,
  status text not null default 'not_started',
  due_at timestamptz,
  completed_at timestamptz,
  owner_profile_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.contractor_assignments (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references public.agencies(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  profile_id uuid references public.profiles(id) on delete set null,
  contractor_name text not null,
  email text,
  role_label text not null,
  call_time_at timestamptz,
  status text not null default 'assigned',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.vendor_assignments (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references public.agencies(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  vendor_name text not null,
  contact_name text,
  contact_email text,
  service_type text not null,
  status text not null default 'assigned',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.incident_logs (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references public.agencies(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  run_of_show_segment_id uuid references public.run_of_show_segments(id) on delete set null,
  severity text not null default 'medium',
  status text not null default 'open',
  title text not null,
  description text,
  resolution text,
  reported_by_profile_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create table if not exists public.testing_console_incidents (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references public.agencies(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  room_label text,
  diagnostic_type text not null,
  severity text not null default 'medium',
  status text not null default 'open',
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create table if not exists public.white_label_backup_rooms (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references public.agencies(id) on delete cascade,
  client_id uuid references public.clients(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  provider text not null default 'zoom',
  label text not null,
  join_url text not null,
  activation_requires_producer_approval boolean not null default true,
  status text not null default 'configured',
  last_tested_at timestamptz,
  activated_at timestamptz,
  activated_by_profile_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.run_of_show_segments enable row level security;
alter table public.production_tasks enable row level security;
alter table public.event_milestones enable row level security;
alter table public.contractor_assignments enable row level security;
alter table public.vendor_assignments enable row level security;
alter table public.incident_logs enable row level security;
alter table public.testing_console_incidents enable row level security;
alter table public.white_label_backup_rooms enable row level security;
