-- 0006_video_provider_abstraction.sql
-- Provider-neutral video rooms, participants, tokens, and recording hooks.

create table if not exists public.video_rooms (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references public.agencies(id) on delete cascade,
  client_id uuid references public.clients(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  provider text not null default 'mock',
  provider_room_id text,
  room_type text not null,
  label text not null,
  status text not null default 'draft',
  join_url text,
  backstage_url text,
  starts_at timestamptz,
  ends_at timestamptz,
  recording_enabled boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.video_room_participants (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references public.agencies(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  room_id uuid not null references public.video_rooms(id) on delete cascade,
  profile_id uuid references public.profiles(id) on delete set null,
  display_name text not null,
  participant_role text not null,
  provider_participant_id text,
  can_publish_audio boolean not null default false,
  can_publish_video boolean not null default false,
  can_share_screen boolean not null default false,
  joined_at timestamptz,
  left_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.video_recordings (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references public.agencies(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  room_id uuid not null references public.video_rooms(id) on delete cascade,
  provider text not null,
  provider_recording_id text,
  status text not null default 'requested',
  started_at timestamptz,
  stopped_at timestamptz,
  asset_record_id uuid references public.asset_records(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.video_provider_health_checks (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references public.agencies(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  room_id uuid references public.video_rooms(id) on delete cascade,
  provider text not null,
  ok boolean not null default false,
  latency_ms integer,
  details jsonb not null default '[]'::jsonb,
  checked_at timestamptz not null default now()
);

alter table public.video_rooms enable row level security;
alter table public.video_room_participants enable row level security;
alter table public.video_recordings enable row level security;
alter table public.video_provider_health_checks enable row level security;
