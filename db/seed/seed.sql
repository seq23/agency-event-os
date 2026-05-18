-- Agency Event OS seed draft
-- This seed is intentionally small. The TypeScript mock data remains the UI-driving seed until Supabase persistence is wired.

insert into public.agencies (id, name, slug, status)
values ('00000000-0000-0000-0000-000000000001', 'West Peek Productions', 'west-peek-productions', 'active')
on conflict (slug) do nothing;

insert into public.clients (id, agency_id, name, slug, industry, primary_contact_name, primary_contact_email, status)
values
  ('00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000001', 'Nova Capital Partners', 'nova-capital', 'Venture Capital', 'Elena Client', 'elena@example.com', 'active'),
  ('00000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000001', 'Lumen Coaching Group', 'lumen-coaching', 'Executive Coaching', 'Priya Mason', 'priya@example.com', 'active'),
  ('00000000-0000-0000-0000-000000000103', '00000000-0000-0000-0000-000000000001', 'Aurora Health Collective', 'aurora-health', 'Healthcare', 'Marcus Lee', 'marcus@example.com', 'active')
on conflict (agency_id, slug) do nothing;

insert into public.events (id, agency_id, client_id, name, slug, event_type, status, start_at, end_at, timezone, description, registration_enabled, venue_enabled, replay_enabled, reporting_enabled)
values
  ('00000000-0000-0000-0000-000000001001', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000101', 'Nova Founder Summit', 'nova-founder-summit', 'virtual_summit', 'pre_event', '2026-06-12T15:00:00Z', '2026-06-12T20:00:00Z', 'America/Chicago', 'A virtual founder summit with main stage, breakouts, sponsor expo, and networking.', true, true, true, true)
on conflict (agency_id, slug) do nothing;
