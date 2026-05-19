-- 0008_livekit_room_ui_runtime.sql
-- LiveKit room UI runtime state, join sessions, and role-aware token issue records.

create table if not exists public.video_room_join_sessions (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid references public.agencies(id) on delete set null,
  event_id uuid references public.events(id) on delete cascade,
  room_id uuid references public.video_rooms(id) on delete cascade,
  profile_id uuid references public.profiles(id) on delete set null,
  display_name text not null,
  participant_role text not null,
  provider text not null default 'livekit',
  token_expires_at timestamptz not null,
  connection_status text not null default 'issued',
  reconnect_attempts integer not null default 0,
  issued_at timestamptz not null default now(),
  joined_at timestamptz,
  disconnected_at timestamptz
);

create table if not exists public.video_room_ui_states (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid references public.agencies(id) on delete set null,
  event_id uuid references public.events(id) on delete cascade,
  room_id uuid references public.video_rooms(id) on delete cascade,
  room_type text not null,
  provider text not null default 'livekit',
  readiness_status text not null default 'not_checked',
  connection_status text not null default 'not_connected',
  active_participant_count integer not null default 0,
  producer_notes text,
  last_health_check_at timestamptz,
  updated_at timestamptz not null default now()
);

alter table public.video_room_join_sessions enable row level security;
alter table public.video_room_ui_states enable row level security;
