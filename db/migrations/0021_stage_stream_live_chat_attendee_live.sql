-- Stage stream state, room chat, and attendee live participation runtime tables.
-- These tables back StreamYard -> LiveKit Ingress, Daily fallback, breakout chat,
-- and crew-controlled attendee camera/mic publishing.

create table if not exists stage_stream_states (
  event_id text not null,
  stage_id text not null,
  state jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (event_id, stage_id)
);

create table if not exists stage_stream_events (
  id text primary key,
  event_id text not null,
  stage_id text not null,
  signal text not null,
  state_event jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists live_chat_messages (
  id text primary key,
  event_id text not null,
  room_kind text not null,
  room_id text not null,
  attendee_id text,
  display_name text not null,
  company text,
  message text not null,
  moderation_status text not null default 'visible',
  created_at timestamptz not null default now()
);

create index if not exists live_chat_messages_room_idx on live_chat_messages (event_id, room_kind, room_id, created_at);

create table if not exists attendee_live_capabilities (
  key text primary key,
  event_id text not null,
  room_kind text not null,
  room_id text not null,
  attendee_id text not null,
  capability jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists attendee_live_control_states (
  key text primary key,
  event_id text not null,
  room_kind text not null,
  room_id text not null,
  state jsonb not null,
  updated_at timestamptz not null default now()
);
