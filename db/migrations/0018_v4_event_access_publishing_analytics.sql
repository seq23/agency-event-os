-- V4 event access, publishing, room fallback, and analytics runtime-state boundary.
-- Existing migrations are intentionally not edited.

create table if not exists event_access_attempts (
  id uuid primary key default gen_random_uuid(),
  event_id uuid,
  access_kind text not null,
  role text,
  route text,
  ip_hash text,
  user_agent_hash text,
  outcome text not null,
  reason text,
  created_at timestamptz not null default now()
);

create table if not exists event_publish_events (
  id uuid primary key default gen_random_uuid(),
  event_id uuid,
  actor_user_id uuid,
  publish_state text not null,
  source text not null,
  validation_status text,
  pull_request_url text,
  created_at timestamptz not null default now()
);

create table if not exists event_room_fallback_states (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null,
  room_id text not null,
  room_type text not null,
  active_provider text not null,
  manual_override_provider text,
  automatic_fallback_enabled boolean not null default true,
  rollback_available boolean not null default true,
  health jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique(event_id, room_id)
);

create table if not exists event_analytics_events (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null,
  kind text not null,
  subject_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
