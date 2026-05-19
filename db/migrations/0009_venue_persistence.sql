-- 0009_venue_persistence.sql
-- Attendee venue persistence, sessions, agenda, expo, people directory, Q&A, polls, and replay metadata.

create table if not exists public.attendees (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references public.agencies(id) on delete cascade,
  client_id uuid references public.clients(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  profile_id uuid references public.profiles(id) on delete set null,
  display_name text not null,
  email text not null,
  company text,
  title text,
  registration_status text not null default 'registered',
  attendee_type text not null default 'general',
  networking_opt_in boolean not null default false,
  checked_in_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.event_sessions (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references public.agencies(id) on delete cascade,
  client_id uuid references public.clients(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  video_room_id uuid references public.video_rooms(id) on delete set null,
  title text not null,
  description text,
  session_type text not null default 'session',
  starts_at timestamptz,
  ends_at timestamptz,
  visibility text not null default 'public',
  status text not null default 'scheduled',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.event_agenda_items (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references public.agencies(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  session_id uuid references public.event_sessions(id) on delete cascade,
  title text not null,
  item_type text not null default 'session',
  starts_at timestamptz,
  ends_at timestamptz,
  room_label text,
  sort_order integer not null default 0,
  is_featured boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.expo_booths (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references public.agencies(id) on delete cascade,
  client_id uuid references public.clients(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  sponsor_id uuid references public.sponsors(id) on delete set null,
  video_room_id uuid references public.video_rooms(id) on delete set null,
  name text not null,
  headline text,
  description text,
  cta_label text,
  cta_url text,
  sort_order integer not null default 0,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.people_directory_entries (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references public.agencies(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  attendee_id uuid references public.attendees(id) on delete cascade,
  display_name text not null,
  company text,
  title text,
  bio text,
  visible boolean not null default true,
  searchable boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.session_questions (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references public.agencies(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  session_id uuid references public.event_sessions(id) on delete cascade,
  attendee_id uuid references public.attendees(id) on delete set null,
  question text not null,
  status text not null default 'submitted',
  upvote_count integer not null default 0,
  created_at timestamptz not null default now(),
  answered_at timestamptz
);

create table if not exists public.session_polls (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references public.agencies(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  session_id uuid references public.event_sessions(id) on delete cascade,
  question text not null,
  options jsonb not null default '[]'::jsonb,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  opened_at timestamptz,
  closed_at timestamptz
);

create table if not exists public.replay_assets (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references public.agencies(id) on delete cascade,
  client_id uuid references public.clients(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  session_id uuid references public.event_sessions(id) on delete set null,
  asset_record_id uuid references public.asset_records(id) on delete set null,
  title text not null,
  status text not null default 'processing',
  duration_seconds integer,
  available_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.attendees enable row level security;
alter table public.event_sessions enable row level security;
alter table public.event_agenda_items enable row level security;
alter table public.expo_booths enable row level security;
alter table public.people_directory_entries enable row level security;
alter table public.session_questions enable row level security;
alter table public.session_polls enable row level security;
alter table public.replay_assets enable row level security;
