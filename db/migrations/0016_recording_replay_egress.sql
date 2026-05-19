-- 0016_recording_replay_egress.sql
-- LiveKit recording/egress jobs and replay publication state.

create table if not exists public.livekit_egress_jobs (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references public.agencies(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  room_id uuid references public.video_rooms(id) on delete set null,
  session_id uuid references public.event_sessions(id) on delete set null,
  provider text not null default 'livekit',
  provider_egress_id text,
  status text not null default 'requested',
  storage_bucket text,
  storage_path text,
  started_at timestamptz,
  stopped_at timestamptz,
  failure_reason text,
  created_at timestamptz not null default now()
);

create table if not exists public.replay_publication_events (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references public.agencies(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  replay_asset_id uuid references public.replay_assets(id) on delete cascade,
  actor_profile_id uuid references public.profiles(id) on delete set null,
  status text not null,
  notes text,
  created_at timestamptz not null default now()
);

alter table public.livekit_egress_jobs enable row level security;
alter table public.replay_publication_events enable row level security;
