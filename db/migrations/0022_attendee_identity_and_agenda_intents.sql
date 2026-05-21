-- Phase 1 attendee identity spine: durable event-scoped attendees, sessions, planning intent, and sponsor opt-in boundaries.

create table if not exists attendee_profiles (
  attendee_id text not null,
  event_id text not null,
  email_hash text not null,
  name text not null,
  email_masked text,
  company text not null,
  title text not null,
  personal_website text,
  social_links jsonb not null default '[]'::jsonb,
  reason_for_attending text,
  interesting_fact text,
  topics_of_interest jsonb not null default '[]'::jsonb,
  networking_goals text,
  networking_opt_in boolean not null default false,
  role text not null default 'attendee',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (event_id, attendee_id),
  unique (event_id, email_hash),
  constraint attendee_profiles_role_check check (role = 'attendee'),
  constraint attendee_profiles_status_check check (status in ('active', 'revoked', 'expired'))
);

create index if not exists attendee_profiles_event_updated_idx on attendee_profiles (event_id, updated_at desc);

create table if not exists attendee_sessions (
  session_id text not null,
  attendee_id text not null,
  event_id text not null,
  role text not null default 'attendee',
  status text not null default 'active',
  issued_at timestamptz not null,
  expires_at timestamptz not null,
  last_seen_at timestamptz,
  primary key (event_id, session_id),
  constraint attendee_sessions_role_check check (role = 'attendee'),
  constraint attendee_sessions_status_check check (status in ('active', 'revoked', 'expired'))
);

create index if not exists attendee_sessions_event_attendee_idx on attendee_sessions (event_id, attendee_id);

create table if not exists attendee_agenda_intents (
  id text primary key,
  attendee_id text not null,
  event_id text not null,
  planned_session_ids jsonb not null default '[]'::jsonb,
  planned_breakout_ids jsonb not null default '[]'::jsonb,
  planned_sponsor_booth_ids jsonb not null default '[]'::jsonb,
  wants_session_reminders boolean not null default false,
  updated_at timestamptz not null default now(),
  unique (event_id, attendee_id)
);

create table if not exists sponsor_lead_opt_ins (
  id text primary key,
  attendee_id text not null,
  event_id text not null,
  sponsor_booth_id text not null,
  allowed_fields jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists sponsor_lead_opt_ins_event_sponsor_idx on sponsor_lead_opt_ins (event_id, sponsor_booth_id, created_at desc);


create table if not exists attendee_permissions (
  id text primary key,
  attendee_id text not null,
  event_id text not null,
  permission_kind text not null,
  granted boolean not null default false,
  granted_by text,
  reason text,
  updated_at timestamptz not null default now(),
  unique(event_id, attendee_id, permission_kind)
);

create index if not exists attendee_permissions_event_attendee_idx on attendee_permissions(event_id, attendee_id);
