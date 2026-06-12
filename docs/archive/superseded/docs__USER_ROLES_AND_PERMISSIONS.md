<!-- ARCHIVED: superseded by active runbooks / ledgers. See docs/archive/ARCHIVE_INDEX.md and docs/DOCS_CONSOLIDATION_MAP.md. -->

# West Peek Live! — User Roles and Permissions

## 1. Purpose

This document defines the role and permission model for West Peek Live!.

The permission system protects:

- Agency data
- Client-facing boundaries
- Contractor/vendor access limits
- Speaker/sponsor privacy
- Attendee experience
- Production control surfaces
- Financial and operational confidentiality

## 2. Permission Philosophy

West Peek Live! is multi-tenant and multi-role. The system must allow collaboration without leaking data.

Rules:

- Agency owners need broad visibility.
- Clients need polished, limited visibility.
- Contractors see only assigned work.
- Vendors see only assigned deliverables.
- Speakers see only their onboarding/session data.
- Sponsors see only their booth/leads/reporting.
- Attendees see only venue-facing content.
- Producers get live production controls.
- Moderators get moderation tools, not business controls.
- Finance gets commercial data, not production control by default.

## 3. Core Permission Rule

Do not scatter raw role checks across components.

All permission logic must route through:

`can(user, action, resource)`

The helper should evaluate:

- User role
- Agency membership
- Client relationship
- Event assignment
- Resource ownership
- Visibility flags
- Explicit grants
- Explicit restrictions

## 4. Scope Levels

### Platform Scope

Reserved for future platform admins.

### Agency Scope

Applies across one agency workspace.

### Client Scope

Applies to one client workspace.

### Event Scope

Applies to one event.

### Own-Record Scope

Applies only to records owned by or assigned to the user.

## 5. Visibility Classes

### Internal Agency

Visible only to agency-side users.

Examples:

- Internal production notes
- Contractor rates
- Vendor costs
- Agency margin
- Private risk notes
- Internal incident notes

### Client-Facing

Visible to approved client users.

Examples:

- Client-facing timeline
- Client-facing run-of-show
- Approval requests
- Event links
- Final reports

### Crew-Limited

Visible only to assigned production contributors.

Examples:

- Contractor call sheet
- Assigned tasks
- Assigned segments
- Relevant assets

### Sponsor-Limited

Visible only to sponsor users for their sponsor/booth.

### Speaker-Limited

Visible only to the speaker and relevant agency users.

### Attendee-Facing

Visible to registered attendees.

## 6. Roles

## 6.1 Agency Owner

Scope: Agency-wide.

Can view, create, edit, approve, and manage all agency-owned records.

Must never:

- Bypass audit logging.
- Delete production history silently.
- Expose internal-only data to clients accidentally.

## 6.2 Agency Admin

Scope: Agency-wide excluding ownership-level controls.

Can manage clients, events, tasks, assignments, speakers, sponsors, vendors, contractors, assets, approvals, and reports.

Must never:

- Transfer agency ownership.
- Remove the Agency Owner.
- Modify billing ownership unless granted.

## 6.3 Executive Producer

Scope: Assigned clients/events.

Can manage event production, run-of-show, tasks, crew, readiness, incidents, and reports for assigned events.

Must never access unrelated client events or modify ownership/billing.

## 6.4 Producer

Scope: Assigned events.

Can run the live event, update production statuses, manage incidents, and work inside the production command center.

Must never modify client contracts, contractor rates, vendor costs, or unrelated events.

## 6.5 Project Manager

Scope: Assigned clients/events.

Can manage tasks, milestones, assets, approvals, speaker/sponsor follow-up, contractor/vendor coordination.

Must never override client approvals or access financial margin unless granted.

## 6.6 Technical Director

Scope: Assigned events.

Can manage tech checks, room configuration, stage/session technical readiness, rehearsal/backstage links.

Must never access financial data, sponsor leads, or agency settings.

## 6.7 Moderator

Scope: Assigned event/room/channel.

Can manage chat, Q&A, polls, reports, and escalation queues.

Must never access production finances, client internal notes, or unrelated event data.

## 6.8 Contractor

Scope: Assigned work only.

Can view assigned events, tasks, call sheets, run-of-show segments, relevant assets, and shared notes.

Must never see:

- Agency margin
- Other contractor rates
- Vendor costs
- Client contract data
- Sponsor leads unless explicitly assigned
- Unassigned events

## 6.9 Vendor

Scope: Assigned deliverables only.

Can view assigned deliverables, due dates, upload/request details, and agency contact.

Must never see:

- Other vendors' pricing/contracts
- Agency margin
- Internal risk notes
- Unrelated event records

## 6.10 Client Owner

Scope: One client workspace and client-facing event records.

Can view client portal, timeline, client-facing run-of-show, approvals, assets, links, reports, and shared summaries.

Can approve assigned approval requests.

Must never see:

- Internal agency notes
- Contractor rates
- Vendor costs
- Agency margin
- Private incident notes
- Other clients

## 6.11 Client Reviewer

Scope: Assigned approval items.

Can review, comment, approve, or request changes on assigned approval items.

Must never see full client workspace unless granted.

## 6.12 Speaker

Scope: Own speaker profile and assigned sessions/events.

Can submit bio, headshot, deck, release, tech check availability, and view backstage/join links.

Must never see other speaker private details, sponsor leads, internal notes, or production command center.

## 6.13 Sponsor Admin

Scope: Own sponsor organization/booth.

Can manage own booth, resources, CTA, representatives, leads, and sponsor report.

Must never see other sponsors, agency margin, client internal notes, or unrelated sponsors.

## 6.14 Sponsor Representative

Scope: Own sponsor participation.

Can view booth schedule and participate in assigned booth/session surfaces.

Cannot view full lead export unless granted.

## 6.15 Attendee

Scope: Registered event venue.

Can access lobby, stage, sessions, networking, expo, people directory, replay, chat, Q&A, polls, and reporting/flagging tools.

Must never access admin, client, or production routes.

## 6.16 Finance

Scope: Agency-wide or assigned finance surfaces.

Can view/edit package, invoice, cost, payment, and margin records when implemented.

Must not control live production unless separately assigned.

## 7. Route Protection

### Public Routes

- `/`
- `/events/[slug]`
- `/events/[slug]/register`
- `/events/[slug]/agenda`
- `/events/[slug]/speakers`
- `/events/[slug]/sponsors`

Public event content can be visible when event is published.

### Agency Routes

- `/app`
- `/app/clients`
- `/app/events`
- `/app/templates`
- `/app/contractors`
- `/app/vendors`
- `/app/assets`
- `/app/reports`
- `/app/settings`

Agency-side roles only.

### Event Admin Routes

- `/app/events/[eventId]/overview`
- `/app/events/[eventId]/builder`
- `/app/events/[eventId]/timeline`
- `/app/events/[eventId]/run-of-show`
- `/app/events/[eventId]/tasks`
- `/app/events/[eventId]/crew`
- `/app/events/[eventId]/vendors`
- `/app/events/[eventId]/speakers`
- `/app/events/[eventId]/sponsors`
- `/app/events/[eventId]/approvals`
- `/app/events/[eventId]/assets`
- `/app/events/[eventId]/producer`
- `/app/events/[eventId]/analytics`
- `/app/events/[eventId]/report`

Agency-side users or specifically assigned event contributors only.

### Client Portal Routes

- `/client/[clientSlug]`
- `/client/[clientSlug]/events/[eventId]`
- `/client/[clientSlug]/events/[eventId]/approvals`
- `/client/[clientSlug]/events/[eventId]/timeline`
- `/client/[clientSlug]/events/[eventId]/run-of-show`
- `/client/[clientSlug]/events/[eventId]/assets`
- `/client/[clientSlug]/events/[eventId]/reports`

Only client-facing fields render.

### Contractor Routes

- `/crew`
- `/crew/events/[eventId]`
- `/crew/events/[eventId]/tasks`
- `/crew/events/[eventId]/call-sheet`
- `/crew/events/[eventId]/run-of-show`

Contractor sees assigned work only.

### Speaker Routes

- `/speaker`
- `/speaker/events/[eventId]`
- `/speaker/events/[eventId]/onboarding`
- `/speaker/events/[eventId]/tech-check`
- `/speaker/events/[eventId]/backstage`

Speaker sees own records only.

### Sponsor Routes

- `/sponsor`
- `/sponsor/events/[eventId]`
- `/sponsor/events/[eventId]/booth`
- `/sponsor/events/[eventId]/leads`
- `/sponsor/events/[eventId]/report`

Sponsor sees own sponsor/booth only.

### Venue Routes

- `/venue/[eventId]/lobby`
- `/venue/[eventId]/stage`
- `/venue/[eventId]/sessions`
- `/venue/[eventId]/sessions/[sessionId]`
- `/venue/[eventId]/networking`
- `/venue/[eventId]/expo`
- `/venue/[eventId]/expo/[boothId]`
- `/venue/[eventId]/people`
- `/venue/[eventId]/replay`
- `/venue/[eventId]/help`

Registered attendees can access when event permits.

## 8. Required Capability Families

- agency
- client
- event
- run_of_show
- production
- task
- asset
- approval
- speaker
- sponsor
- contractor
- vendor
- venue
- moderation
- analytics
- finance
- audit

## 9. Audit Log Requirements

Major actions must be audit-loggable:

- Event created/status changed
- Role assigned/revoked
- Client approval requested/approved/changes requested
- Run-of-show changed
- Speaker readiness changed
- Sponsor booth changed
- Contractor/vendor assigned
- Asset uploaded/approved
- Production note added
- Incident logged
- Report exported

## 10. Unit Test Expectations

Permissions tests should cover:

- Agency Owner broad access
- Admin restrictions
- Assigned vs unrelated event access
- Contractor assigned-only access
- Vendor assigned-only access
- Client-facing-only portal rendering
- Speaker own-record access
- Sponsor own-booth/lead access
- Attendee denied from admin routes
- Finance denied from production controls
- Locked approval restrictions

## 11. Final Permission Principle

Every user sees exactly what helps them do their job — and nothing that creates risk, confusion, or unnecessary exposure.
