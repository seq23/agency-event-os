-- 0017_email_production_sending.sql
-- Production email sending logs, delivery attempts, and workflow status records.

create table if not exists public.email_send_logs (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid references public.agencies(id) on delete set null,
  client_id uuid references public.clients(id) on delete set null,
  event_id uuid references public.events(id) on delete set null,
  workflow_type text not null,
  recipient_email text not null,
  recipient_name text,
  subject text not null,
  provider text not null default 'resend',
  provider_message_id text,
  status text not null default 'queued',
  action_url text,
  failure_reason text,
  metadata jsonb not null default '{}'::jsonb,
  queued_at timestamptz not null default now(),
  sent_at timestamptz,
  failed_at timestamptz
);

create table if not exists public.email_delivery_attempts (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid references public.agencies(id) on delete set null,
  event_id uuid references public.events(id) on delete set null,
  email_send_log_id uuid references public.email_send_logs(id) on delete cascade,
  provider text not null default 'resend',
  provider_message_id text,
  status text not null,
  failure_reason text,
  attempted_at timestamptz not null default now()
);

create table if not exists public.email_workflow_statuses (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid references public.agencies(id) on delete cascade,
  event_id uuid references public.events(id) on delete cascade,
  workflow_type text not null,
  enabled boolean not null default true,
  live_sending_enabled boolean not null default false,
  last_sent_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (agency_id, event_id, workflow_type)
);

alter table public.email_send_logs enable row level security;
alter table public.email_delivery_attempts enable row level security;
alter table public.email_workflow_statuses enable row level security;
