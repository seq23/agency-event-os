<!-- ARCHIVED: superseded by active runbooks / ledgers. See docs/archive/ARCHIVE_INDEX.md and docs/DOCS_CONSOLIDATION_MAP.md. -->

# West Peek Live! — Database Schema

## 1. Purpose

This document defines the production-intent database schema for West Peek Live!.

The schema is designed for a multi-tenant SaaS application where agencies produce virtual events for multiple clients.

Core hierarchy:

`Agency → Clients → Events → Production Plan / Venue / Reports`

## 2. Schema Principles

### Multi-Tenant Ownership

Every major record must include one or more of:

- `agency_id`
- `client_id`
- `event_id`
- `created_by_user_id`
- `updated_by_user_id`

No core production data should be scoped only by `user_id`.

### Soft Deletes by Default

Recommended fields:

- `deleted_at`
- `deleted_by_user_id`

### Auditability

Major admin/production actions should write to `audit_logs`.

### Visibility Separation

Records that may be internal or client-facing should include:

- `visibility`
- `client_visible`
- `internal_notes`
- `client_facing_notes`

### Explicit Status Fields

Every workflow needs explicit states: event, task, approval, speaker, sponsor, contractor, vendor, video room, networking match, report.

### Provider Abstraction

Provider-specific video IDs belong in video tables only.

## 3. Core Entity Groups

1. Identity and access
2. Agency/client layer
3. Event layer
4. Production layer
5. Run-of-show layer
6. Contractor/vendor layer
7. Speaker layer
8. Sponsor/expo layer
9. Asset/approval layer
10. Venue layer
11. Video layer
12. Networking layer
13. Analytics/reporting layer
14. Notifications
15. Governance/audit layer

## 4. Identity and Access Tables

### users

Purpose: platform user profile.

Fields:

- `id`
- `external_auth_id`
- `email`
- `full_name`
- `avatar_url`
- `timezone`
- `phone`
- `status`
- `last_login_at`
- `created_at`
- `updated_at`
- `deleted_at`

Statuses:

- `active`
- `invited`
- `disabled`
- `deleted`

### role_assignments

Purpose: explicit role assignment across scopes.

Fields:

- `id`
- `user_id`
- `role`
- `scope_type`
- `scope_id`
- `agency_id`
- `client_id`
- `event_id`
- `assigned_by_user_id`
- `status`
- `starts_at`
- `ends_at`
- `created_at`
- `updated_at`

Scope types:

- `platform`
- `agency`
- `client`
- `event`
- `contractor_assignment`
- `vendor_assignment`
- `speaker_profile`
- `sponsor_booth`
- `attendee`

## 5. Agency and Client Tables

### agencies

Fields:

- `id`
- `name`
- `slug`
- `legal_name`
- `website_url`
- `logo_url`
- `primary_color`
- `owner_user_id`
- `status`
- `created_at`
- `updated_at`
- `deleted_at`

### agency_members

Fields:

- `id`
- `agency_id`
- `user_id`
- `role`
- `status`
- `invited_by_user_id`
- `invited_at`
- `joined_at`
- `created_at`
- `updated_at`

Roles:

- `agency_owner`
- `agency_admin`
- `executive_producer`
- `producer`
- `project_manager`
- `technical_director`
- `moderator`
- `finance`

### clients

Fields:

- `id`
- `agency_id`
- `name`
- `slug`
- `industry`
- `website_url`
- `logo_url`
- `primary_contact_id`
- `status`
- `internal_notes`
- `created_by_user_id`
- `updated_by_user_id`
- `created_at`
- `updated_at`
- `deleted_at`

### client_contacts

Fields:

- `id`
- `agency_id`
- `client_id`
- `user_id`
- `name`
- `email`
- `phone`
- `title`
- `role`
- `is_primary`
- `status`
- `created_at`
- `updated_at`

### client_brand_assets

Fields:

- `id`
- `agency_id`
- `client_id`
- `asset_id`
- `asset_type`
- `usage_notes`
- `approved_for_reuse`
- `created_at`
- `updated_at`

## 6. Event Tables

### events

Fields:

- `id`
- `agency_id`
- `client_id`
- `created_from_template_id`
- `name`
- `slug`
- `event_type`
- `status`
- `start_at`
- `end_at`
- `timezone`
- `description`
- `internal_goal`
- `client_facing_goal`
- `primary_producer_user_id`
- `project_manager_user_id`
- `registration_enabled`
- `venue_enabled`
- `replay_enabled`
- `reporting_enabled`
- `created_by_user_id`
- `updated_by_user_id`
- `created_at`
- `updated_at`
- `deleted_at`

Event types:

- `virtual_summit`
- `webinar`
- `demo_day`
- `sponsor_expo`
- `paid_workshop`
- `executive_roundtable`
- `community_event`
- `course_launch`
- `internal_town_hall`
- `hybrid_support`

Statuses:

- `draft`
- `published`
- `registration_open`
- `pre_event`
- `live`
- `ended`
- `replay_available`
- `archived`

### event_branding

Fields:

- `id`
- `agency_id`
- `client_id`
- `event_id`
- `logo_url`
- `cover_image_url`
- `primary_color`
- `secondary_color`
- `accent_color`
- `font_family`
- `custom_css_notes`
- `status`
- `created_at`
- `updated_at`

### event_settings

Fields:

- `id`
- `agency_id`
- `client_id`
- `event_id`
- `registration_mode`
- `access_mode`
- `chat_enabled`
- `q_and_a_enabled`
- `polls_enabled`
- `networking_enabled`
- `expo_enabled`
- `people_directory_enabled`
- `recording_enabled`
- `replay_enabled`
- `client_portal_enabled`
- `created_at`
- `updated_at`

### event_templates

Fields:

- `id`
- `agency_id`
- `name`
- `slug`
- `event_type`
- `description`
- `default_duration_minutes`
- `status`
- `created_by_user_id`
- `updated_by_user_id`
- `created_at`
- `updated_at`
- `deleted_at`

### event_template_tasks

Fields:

- `id`
- `agency_id`
- `event_template_id`
- `title`
- `description`
- `relative_due_day`
- `priority`
- `default_owner_role`
- `client_visible`
- `sort_order`
- `created_at`
- `updated_at`

### event_template_rooms

Fields:

- `id`
- `agency_id`
- `event_template_id`
- `room_type`
- `name`
- `description`
- `capacity`
- `sort_order`
- `created_at`
- `updated_at`

### event_template_run_of_show_segments

Fields:

- `id`
- `agency_id`
- `event_template_id`
- `segment_title`
- `relative_start_minute`
- `duration_minutes`
- `room_type`
- `default_speaker_role`
- `default_crew_role`
- `producer_notes_template`
- `technical_cues_template`
- `sort_order`
- `created_at`
- `updated_at`

### event_lifecycle_events

Fields:

- `id`
- `agency_id`
- `client_id`
- `event_id`
- `from_status`
- `to_status`
- `changed_by_user_id`
- `reason`
- `changed_at`

## 7. Production Tables

### event_milestones

Fields:

- `id`
- `agency_id`
- `client_id`
- `event_id`
- `title`
- `description`
- `status`
- `due_at`
- `completed_at`
- `completed_by_user_id`
- `client_visible`
- `sort_order`
- `created_by_user_id`
- `updated_by_user_id`
- `created_at`
- `updated_at`
- `deleted_at`

### event_tasks

Fields:

- `id`
- `agency_id`
- `client_id`
- `event_id`
- `milestone_id`
- `title`
- `description`
- `status`
- `priority`
- `assigned_to_user_id`
- `assigned_role`
- `due_at`
- `completed_at`
- `completed_by_user_id`
- `client_visible`
- `internal_notes`
- `client_facing_notes`
- `linked_resource_type`
- `linked_resource_id`
- `created_by_user_id`
- `updated_by_user_id`
- `created_at`
- `updated_at`
- `deleted_at`

Task statuses:

- `not_started`
- `in_progress`
- `blocked`
- `waiting_on_client`
- `waiting_on_speaker`
- `waiting_on_sponsor`
- `waiting_on_vendor`
- `complete`
- `cancelled`

### task_dependencies

Fields:

- `id`
- `agency_id`
- `event_id`
- `blocking_task_id`
- `blocked_task_id`
- `created_at`
- `updated_at`

### production_notes

Fields:

- `id`
- `agency_id`
- `client_id`
- `event_id`
- `note_type`
- `visibility`
- `body`
- `linked_resource_type`
- `linked_resource_id`
- `created_by_user_id`
- `updated_by_user_id`
- `created_at`
- `updated_at`
- `deleted_at`

### incident_logs

Fields:

- `id`
- `agency_id`
- `client_id`
- `event_id`
- `severity`
- `status`
- `title`
- `description`
- `visibility`
- `reported_by_user_id`
- `assigned_to_user_id`
- `resolved_at`
- `resolved_by_user_id`
- `resolution_notes`
- `created_at`
- `updated_at`
- `deleted_at`

## 8. Run-of-Show Tables

### run_of_show_segments

Fields:

- `id`
- `agency_id`
- `client_id`
- `event_id`
- `agenda_item_id`
- `session_id`
- `stage_id`
- `segment_title`
- `public_title`
- `start_at`
- `end_at`
- `duration_minutes`
- `sort_order`
- `speaker_id`
- `sponsor_id`
- `responsible_user_id`
- `responsible_role`
- `producer_notes`
- `technical_cues`
- `client_facing_description`
- `backup_plan`
- `poll_cue`
- `q_and_a_cue`
- `sponsor_mention`
- `readiness_status`
- `approval_status`
- `client_visible`
- `locked`
- `created_by_user_id`
- `updated_by_user_id`
- `created_at`
- `updated_at`
- `deleted_at`

Readiness statuses:

- `not_started`
- `needs_assets`
- `needs_speaker`
- `needs_approval`
- `ready`
- `at_risk`
- `blocked`

Approval statuses:

- `draft`
- `needs_agency_review`
- `sent_to_client`
- `client_changes_requested`
- `approved`
- `locked`

### run_of_show_assets

Fields:

- `id`
- `agency_id`
- `client_id`
- `event_id`
- `run_of_show_segment_id`
- `asset_id`
- `usage_type`
- `required`
- `status`
- `created_at`
- `updated_at`

### run_of_show_versions

Post-MVP Scope table for version snapshots.

## 9. Contractor and Vendor Tables

### contractors

Fields:

- `id`
- `agency_id`
- `user_id`
- `name`
- `email`
- `phone`
- `timezone`
- `primary_role`
- `skills`
- `rate_type`
- `rate_amount`
- `availability_notes`
- `reliability_notes`
- `status`
- `internal_notes`
- `created_at`
- `updated_at`
- `deleted_at`

### contractor_assignments

Fields:

- `id`
- `agency_id`
- `client_id`
- `event_id`
- `contractor_id`
- `user_id`
- `role`
- `status`
- `call_time_at`
- `end_time_at`
- `assigned_by_user_id`
- `assignment_notes`
- `shared_notes`
- `created_at`
- `updated_at`
- `deleted_at`

### contractor_assignment_tasks

Fields:

- `id`
- `agency_id`
- `client_id`
- `event_id`
- `contractor_assignment_id`
- `task_id`
- `created_at`
- `updated_at`

### vendors

Fields:

- `id`
- `agency_id`
- `name`
- `service_category`
- `website_url`
- `primary_contact_name`
- `primary_contact_email`
- `primary_contact_phone`
- `status`
- `internal_notes`
- `created_at`
- `updated_at`
- `deleted_at`

### vendor_assignments

Fields:

- `id`
- `agency_id`
- `client_id`
- `event_id`
- `vendor_id`
- `service_category`
- `status`
- `assigned_by_user_id`
- `primary_contact_user_id`
- `due_at`
- `internal_notes`
- `shared_notes`
- `created_at`
- `updated_at`
- `deleted_at`

### vendor_deliverables

Fields:

- `id`
- `agency_id`
- `client_id`
- `event_id`
- `vendor_assignment_id`
- `title`
- `description`
- `status`
- `due_at`
- `completed_at`
- `shared_with_vendor`
- `linked_asset_id`
- `created_at`
- `updated_at`

## 10. Speaker Tables

### speaker_profiles

Fields:

- `id`
- `agency_id`
- `client_id`
- `event_id`
- `user_id`
- `name`
- `title`
- `company`
- `email`
- `phone`
- `bio`
- `headshot_asset_id`
- `pronunciation_notes`
- `social_links_json`
- `readiness_status`
- `release_status`
- `tech_check_status`
- `internal_notes`
- `created_at`
- `updated_at`
- `deleted_at`

### speaker_assets

Fields:

- `id`
- `agency_id`
- `client_id`
- `event_id`
- `speaker_profile_id`
- `asset_id`
- `asset_type`
- `status`
- `required`
- `submitted_at`
- `approved_at`
- `approved_by_user_id`
- `created_at`
- `updated_at`

### speaker_assignments

Fields:

- `id`
- `agency_id`
- `client_id`
- `event_id`
- `speaker_profile_id`
- `session_id`
- `agenda_item_id`
- `run_of_show_segment_id`
- `role`
- `status`
- `created_at`
- `updated_at`

### speaker_tech_checks

Fields:

- `id`
- `agency_id`
- `client_id`
- `event_id`
- `speaker_profile_id`
- `scheduled_at`
- `completed_at`
- `status`
- `technical_director_user_id`
- `notes`
- `issues_found`
- `created_at`
- `updated_at`

## 11. Sponsor and Expo Tables

### sponsors

Fields:

- `id`
- `agency_id`
- `client_id`
- `event_id`
- `name`
- `website_url`
- `tier`
- `status`
- `primary_contact_name`
- `primary_contact_email`
- `internal_notes`
- `created_at`
- `updated_at`
- `deleted_at`

### sponsor_contacts

Fields:

- `id`
- `agency_id`
- `client_id`
- `event_id`
- `sponsor_id`
- `user_id`
- `name`
- `email`
- `phone`
- `title`
- `role`
- `status`
- `created_at`
- `updated_at`

### sponsor_booths

Fields:

- `id`
- `agency_id`
- `client_id`
- `event_id`
- `sponsor_id`
- `name`
- `description`
- `logo_asset_id`
- `cta_label`
- `cta_url`
- `offer_text`
- `video_url`
- `status`
- `lead_routing_email`
- `approval_status`
- `created_at`
- `updated_at`

### booth_resources

Fields:

- `id`
- `agency_id`
- `client_id`
- `event_id`
- `sponsor_booth_id`
- `asset_id`
- `title`
- `description`
- `resource_type`
- `url`
- `status`
- `sort_order`
- `created_at`
- `updated_at`

### booth_representatives

Fields:

- `id`
- `agency_id`
- `client_id`
- `event_id`
- `sponsor_booth_id`
- `sponsor_contact_id`
- `user_id`
- `role`
- `status`
- `created_at`
- `updated_at`

### sponsor_leads

Fields:

- `id`
- `agency_id`
- `client_id`
- `event_id`
- `sponsor_id`
- `sponsor_booth_id`
- `attendee_id`
- `name`
- `email`
- `company`
- `message`
- `interest_level`
- `source_action`
- `created_at`

### sponsor_deliverables

Fields:

- `id`
- `agency_id`
- `client_id`
- `event_id`
- `sponsor_id`
- `title`
- `description`
- `deliverable_type`
- `status`
- `due_at`
- `completed_at`
- `linked_asset_id`
- `created_at`
- `updated_at`

## 12. Asset and Approval Tables

### assets

Fields:

- `id`
- `agency_id`
- `client_id`
- `event_id`
- `owner_user_id`
- `asset_type`
- `name`
- `description`
- `file_url`
- `external_url`
- `mime_type`
- `file_size_bytes`
- `status`
- `visibility`
- `current_version_id`
- `usage_rights`
- `expires_at`
- `created_at`
- `updated_at`
- `deleted_at`

### asset_versions

Fields:

- `id`
- `agency_id`
- `client_id`
- `event_id`
- `asset_id`
- `version_number`
- `file_url`
- `external_url`
- `uploaded_by_user_id`
- `status`
- `notes`
- `created_at`

### approval_requests

Fields:

- `id`
- `agency_id`
- `client_id`
- `event_id`
- `approval_type`
- `title`
- `description`
- `status`
- `resource_type`
- `resource_id`
- `requested_by_user_id`
- `assigned_to_user_id`
- `assigned_role`
- `due_at`
- `client_visible`
- `locked`
- `approved_at`
- `approved_by_user_id`
- `created_at`
- `updated_at`
- `deleted_at`

### approval_comments

Fields:

- `id`
- `agency_id`
- `client_id`
- `event_id`
- `approval_request_id`
- `author_user_id`
- `body`
- `visibility`
- `created_at`
- `updated_at`
- `deleted_at`

### approval_decisions

Fields:

- `id`
- `agency_id`
- `client_id`
- `event_id`
- `approval_request_id`
- `decision`
- `decided_by_user_id`
- `notes`
- `created_at`

## 13. Venue Tables

### ticket_types

Post-MVP Scope paid ticketing-ready table.

### registrations

Fields:

- `id`
- `agency_id`
- `client_id`
- `event_id`
- `ticket_type_id`
- `user_id`
- `attendee_id`
- `email`
- `name`
- `company`
- `title`
- `status`
- `registered_at`
- `checked_in_at`
- `source`
- `created_at`
- `updated_at`

### attendees

Fields:

- `id`
- `agency_id`
- `client_id`
- `event_id`
- `user_id`
- `registration_id`
- `name`
- `email`
- `company`
- `title`
- `bio`
- `avatar_url`
- `visibility`
- `networking_enabled`
- `status`
- `created_at`
- `updated_at`

### agenda_items

Fields:

- `id`
- `agency_id`
- `client_id`
- `event_id`
- `title`
- `description`
- `start_at`
- `end_at`
- `session_id`
- `stage_id`
- `visibility`
- `status`
- `sort_order`
- `created_at`
- `updated_at`

### stages

Fields:

- `id`
- `agency_id`
- `client_id`
- `event_id`
- `name`
- `description`
- `status`
- `video_room_id`
- `sort_order`
- `created_at`
- `updated_at`

### sessions

Fields:

- `id`
- `agency_id`
- `client_id`
- `event_id`
- `name`
- `description`
- `session_type`
- `status`
- `capacity`
- `start_at`
- `end_at`
- `video_room_id`
- `moderator_user_id`
- `created_at`
- `updated_at`

### session_participants

Fields:

- `id`
- `agency_id`
- `client_id`
- `event_id`
- `session_id`
- `user_id`
- `attendee_id`
- `role`
- `status`
- `joined_at`
- `left_at`
- `created_at`
- `updated_at`

### chat_channels / chat_messages

Support event, stage, session, booth, networking, and support chat contexts.

### q_and_a_questions / polls / poll_votes

Support Q&A and polling for stage/session/booth resources.

### recordings

Tracks replay and recording metadata.

## 14. Video Tables

### video_rooms

Fields:

- `id`
- `agency_id`
- `client_id`
- `event_id`
- `room_type`
- `resource_type`
- `resource_id`
- `provider`
- `provider_room_id`
- `name`
- `status`
- `starts_at`
- `ends_at`
- `recording_enabled`
- `created_by_user_id`
- `created_at`
- `updated_at`

Room types:

- `main_stage`
- `backstage`
- `breakout_session`
- `networking_match`
- `sponsor_booth`
- `rehearsal_room`

Providers:

- `seeded`
- `livekit`
- `daily`
- `agora`
- `mux`
- `twilio`
- `other`

### video_room_participants

Tracks user/attendee participation in video rooms.

## 15. Networking Tables

### networking_settings

Event-level networking configuration.

### networking_queue_entries

Attendees waiting for matches.

### networking_matches

Fields include:

- `attendee_one_id`
- `attendee_two_id`
- `video_room_id`
- `status`
- `started_at`
- `ended_at`
- `expires_at`

Statuses:

- `matched`
- `in_call`
- `completed`
- `skipped`
- `reported`
- `expired`
- `cancelled`

### networking_connections

Mutual connection outcomes.

### networking_reports

Reports/flags from networking interactions.

## 16. Analytics and Reporting Tables

### analytics_events

Stores product/event analytics.

Examples:

- `registration_created`
- `attendee_checked_in`
- `stage_viewed`
- `session_joined`
- `booth_viewed`
- `booth_cta_clicked`
- `resource_downloaded`
- `sponsor_lead_submitted`
- `networking_queued`
- `networking_matched`
- `chat_message_sent`
- `question_submitted`
- `poll_voted`
- `replay_viewed`
- `report_exported`

### event_reports

Event-level report record.

### client_reports

Client-facing post-event report.

### sponsor_reports

Sponsor-specific report.

### report_sections

Modular report content.

### report_exports

Tracks exported PDF/CSV/HTML/JSON outputs.

## 17. Notifications

### notifications

Fields:

- `id`
- `agency_id`
- `client_id`
- `event_id`
- `user_id`
- `notification_type`
- `title`
- `body`
- `resource_type`
- `resource_id`
- `status`
- `read_at`
- `created_at`

## 18. Governance and Audit

### audit_logs

Immutable audit trail.

Fields:

- `id`
- `agency_id`
- `client_id`
- `event_id`
- `actor_user_id`
- `actor_role`
- `action`
- `resource_type`
- `resource_id`
- `previous_value_json`
- `new_value_json`
- `visibility`
- `ip_address`
- `user_agent`
- `created_at`

### system_events

Internal system events not necessarily caused by a user.

## 19. RLS Assumptions

- Agency users access records in their agency, restricted by role.
- Client users access client-facing records for their client.
- Contractors access assigned work only.
- Vendors access assigned deliverables only.
- Speakers access own speaker records only.
- Sponsors access own sponsor/booth/leads/reporting only.
- Attendees access registered venue records only.

## 20. MVP Seeded Data Mapping

Seeded data should represent:

- agencies
- users
- agency_members
- clients
- client_contacts
- events
- event_settings
- event_templates
- event_milestones
- event_tasks
- run_of_show_segments
- contractors
- contractor_assignments
- vendors
- vendor_assignments
- speaker_profiles
- speaker_assignments
- sponsors
- sponsor_booths
- sponsor_deliverables
- assets
- approval_requests
- approval_comments
- attendees
- agenda_items
- stages
- sessions
- video_rooms
- networking_matches
- analytics_events
- event_reports
- client_reports
- sponsor_reports
- audit_logs

## 21. Acceptance Criteria

Schema supports:

- Multi-client agency architecture
- Internal/client-facing separation
- Event lifecycle
- Templates
- Run-of-show as first-class data
- Contractor/vendor assignments
- Speaker onboarding
- Sponsor booth/leads
- Client approvals
- Asset versioning
- Venue/session/stage structure
- Video provider abstraction
- Networking state
- Analytics/reporting
- Audit logging
- Future Supabase RLS

## 22. Final Schema Principle

West Peek Live! is not an event app with clients bolted on later. It is an agency-first production system where every event belongs to a client, every client belongs to an agency, every production surface has ownership, and every external user sees only the slice required to do their job.


## Attendee retention policy

Default attendee retention is event-scoped and cost-aware: attendee profiles, registrations, attendance summaries, and sponsor opt-ins are retained for 12 months unless a client policy shortens that window. Raw chat is retained for 90–180 days. Presence, telemetry, access attempts, and short-lived attendee session tokens expire within the live/replay support window or 30–90 days depending on operational need. Raw analytics should be aggregated or anonymized after 90–180 days. All queries must filter by `eventId`, paginate, and select only needed columns.
