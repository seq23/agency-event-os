-- 0010_speed_networking_engine.sql
-- Speed networking queue, 3-minute match lifecycle, temporary room linkage, skip/report/end flow.

create table if not exists public.speed_networking_queues (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references public.agencies(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  label text not null default 'Main speed networking queue',
  status text not null default 'open',
  match_duration_seconds integer not null default 180,
  duplicate_cooldown_minutes integer not null default 60,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.speed_networking_entries (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references public.agencies(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  queue_id uuid not null references public.speed_networking_queues(id) on delete cascade,
  attendee_id uuid references public.attendees(id) on delete cascade,
  display_name text not null,
  status text not null default 'waiting',
  joined_queue_at timestamptz not null default now(),
  last_matched_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.speed_networking_matches (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references public.agencies(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  queue_id uuid not null references public.speed_networking_queues(id) on delete cascade,
  participant_a_entry_id uuid not null references public.speed_networking_entries(id) on delete cascade,
  participant_b_entry_id uuid not null references public.speed_networking_entries(id) on delete cascade,
  video_room_id uuid references public.video_rooms(id) on delete set null,
  status text not null default 'created',
  starts_at timestamptz not null default now(),
  ends_at timestamptz,
  expires_at timestamptz not null default now() + interval '3 minutes',
  ended_reason text,
  created_at timestamptz not null default now()
);

create table if not exists public.speed_networking_reports (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references public.agencies(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  match_id uuid references public.speed_networking_matches(id) on delete cascade,
  reporter_entry_id uuid references public.speed_networking_entries(id) on delete set null,
  report_type text not null,
  notes text,
  status text not null default 'open',
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create table if not exists public.speed_networking_skips (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references public.agencies(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  queue_id uuid references public.speed_networking_queues(id) on delete cascade,
  entry_id uuid references public.speed_networking_entries(id) on delete cascade,
  skipped_entry_id uuid references public.speed_networking_entries(id) on delete cascade,
  reason text,
  created_at timestamptz not null default now()
);

alter table public.speed_networking_queues enable row level security;
alter table public.speed_networking_entries enable row level security;
alter table public.speed_networking_matches enable row level security;
alter table public.speed_networking_reports enable row level security;
alter table public.speed_networking_skips enable row level security;
