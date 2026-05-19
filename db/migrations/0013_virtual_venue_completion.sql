-- 0013_virtual_venue_completion.sql
-- Virtual venue completion: breakouts, help requests, sponsor leads, attendee room visits.

create table if not exists public.breakout_rooms (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references public.agencies(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  session_id uuid references public.event_sessions(id) on delete set null,
  video_room_id uuid references public.video_rooms(id) on delete set null,
  title text not null,
  description text,
  host_name text,
  capacity integer not null default 25,
  current_count integer not null default 0,
  status text not null default 'open',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.sponsor_leads (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references public.agencies(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  sponsor_id uuid references public.sponsors(id) on delete set null,
  booth_id uuid references public.expo_booths(id) on delete set null,
  attendee_id uuid references public.attendees(id) on delete set null,
  name text not null,
  email text not null,
  company text,
  interest text,
  consent_to_share boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.help_requests (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references public.agencies(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  attendee_id uuid references public.attendees(id) on delete set null,
  topic text not null,
  subject text not null,
  message text not null,
  status text not null default 'open',
  incident_id uuid references public.incident_logs(id) on delete set null,
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create table if not exists public.attendee_room_visits (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references public.agencies(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  attendee_id uuid references public.attendees(id) on delete set null,
  room_type text not null,
  room_id text not null,
  entered_at timestamptz not null default now(),
  left_at timestamptz
);

alter table public.breakout_rooms enable row level security;
alter table public.sponsor_leads enable row level security;
alter table public.help_requests enable row level security;
alter table public.attendee_room_visits enable row level security;
