-- Batch 3C: approval, production inbox, and last-minute change-control persistence.
-- Safe additive migration. Does not enable/alter RLS policies.

create table if not exists public.production_inbox_items (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references public.agencies(id) on delete cascade,
  client_id uuid references public.clients(id) on delete cascade,
  event_id uuid references public.events(id) on delete cascade,
  event_code text not null,
  source_channel text not null,
  status text not null default 'new',
  sender_name text not null,
  sender_email text not null,
  subject text not null,
  summary text,
  possible_match_type text,
  possible_match_id uuid,
  linked_resource_type text,
  linked_resource_id uuid,
  next_action text,
  received_at timestamptz not null default now(),
  converted_at timestamptz,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.last_minute_change_requests (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references public.agencies(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  speaker_id uuid,
  sponsor_id uuid,
  run_of_show_segment_id uuid,
  change_type text not null,
  urgency text not null default 'normal',
  risk text not null default 'low',
  status text not null default 'submitted',
  title text not null,
  old_version_label text,
  new_version_label text,
  diff_summary text,
  affects_timing boolean not null default false,
  affects_sponsor_mention boolean not null default false,
  affects_client_approved_copy boolean not null default false,
  minutes_until_segment integer not null default 0,
  recommended_action text,
  submitted_by_user_id uuid references public.profiles(id),
  decided_by_user_id uuid references public.profiles(id),
  submitted_at timestamptz not null default now(),
  decided_at timestamptz,
  pushed_to_live_at timestamptz,
  rolled_back_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_production_inbox_event_status on public.production_inbox_items(event_id, status, received_at);
create index if not exists idx_last_minute_changes_event_status on public.last_minute_change_requests(event_id, status, urgency);
create index if not exists idx_last_minute_changes_risk on public.last_minute_change_requests(event_id, risk);
