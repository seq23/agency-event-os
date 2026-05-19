-- 0015_live_production_operations.sql
-- Live production state transitions and operator controls.

create table if not exists public.live_production_state_events (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references public.agencies(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  actor_profile_id uuid references public.profiles(id) on delete set null,
  state_type text not null,
  state_value text not null,
  target_type text,
  target_id uuid,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.live_room_statuses (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references public.agencies(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  room_type text not null,
  room_id text not null,
  status text not null default 'closed',
  active_participant_count integer not null default 0,
  last_changed_at timestamptz not null default now()
);

create table if not exists public.backup_room_activations (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references public.agencies(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  provider text not null,
  backup_url text not null,
  reason text not null,
  activated_by_profile_id uuid references public.profiles(id) on delete set null,
  activated_at timestamptz not null default now(),
  deactivated_at timestamptz
);

alter table public.live_production_state_events enable row level security;
alter table public.live_room_statuses enable row level security;
alter table public.backup_room_activations enable row level security;
