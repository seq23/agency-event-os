<!-- ARCHIVED: superseded by active runbooks / ledgers. See docs/archive/ARCHIVE_INDEX.md and docs/DOCS_CONSOLIDATION_MAP.md. -->

# West Peek Live! — MVP Scope

## 1. Purpose

This document defines the first build scope for West Peek Live!.

The MVP is the smallest coherent product foundation that proves the core thesis:

**West Peek Live! helps agencies plan, produce, run, and report on virtual events for multiple clients from one production command center.**

## 2. MVP Strategy

The MVP should be a seeded-data-powered clickable SaaS shell with production-grade architecture foundations.

It should show an agency owner how to:

1. View clients.
2. View events.
3. Track readiness.
4. Build a run-of-show.
5. Assign contractors and vendors.
6. Onboard speakers and sponsors.
7. Send client approvals.
8. Open production command center.
9. Preview attendee venue.
10. View post-event report shells.

The MVP does not need real video, payments, database persistence, or production auth.

## 3. MVP Non-Negotiables

- Multi-client agency architecture
- Agency owner dashboard
- Client and event management
- Event overview with readiness scoring
- Run-of-show builder shell
- Production command center shell
- Contractor/vendor assignment shell
- Speaker onboarding shell
- Sponsor/expo onboarding shell
- Client approval portal shell
- Virtual venue shell
- Post-event report shell
- Centralized permissions
- Seeded data separated from production data
- Documentation and technical debt register

## 4. Primary User

The MVP is designed for the agency owner / executive producer first.

The first screen should answer:

- What events are coming up?
- Which events are at risk?
- Which approvals are blocking progress?
- Which speakers are not ready?
- Which sponsors are missing assets?
- Which contractors have not confirmed?
- Which reports are due?

## 5. In Scope

- Seeded-data SaaS app shell
- Core routes
- Core layout/navigation
- Shared status components
- Role definitions
- Permission helper
- Seeded data layer
- Agency dashboard
- Client pages
- Event pages
- Run-of-show shell
- Task/milestone shell
- Contractor/vendor shell
- Speaker/sponsor shell
- Client approval shell
- Venue shell
- Analytics/report shell
- Documentation

## 6. Out of Scope

- Real video provider integration
- Raw WebRTC
- Paid ticketing
- Full database persistence
- Production auth
- Native mobile apps
- Enterprise SSO
- AI matchmaking
- Advanced replay editing
- Automated contractor payments
- Custom domains
- Full email marketing
- Full CRM
- Advanced sponsor billing
- Hybrid badge scanning

## 7. Required MVP Modules

### Agency Dashboard

Must show:

- Active clients
- Upcoming events
- Events at risk
- Pending approvals
- Contractor confirmations
- Missing speaker/sponsor assets
- Reports due
- Readiness overview

### Client Management

Routes:

- `/app/clients`
- `/app/clients/[clientId]`

Must show:

- Client list
- Client status
- Active events
- Primary contact
- Open approvals
- Latest report status

### Event Portfolio and Overview

Routes:

- `/app/events`
- `/app/events/[eventId]/overview`

Must show:

- Event name
- Client
- Type
- Lifecycle status
- Date
- Readiness score
- Blocking issues
- Assigned producer

### Event Templates

Route:

- `/app/templates`

Must show template cards for:

- Virtual Summit
- Webinar
- Demo Day
- Sponsor Expo
- Paid Workshop
- Executive Roundtable

### Run-of-Show Builder

Route:

- `/app/events/[eventId]/run-of-show`

Each segment should include:

- Start/end time
- Duration
- Segment title
- Room/stage
- Speaker
- Producer notes
- Technical cues
- Assets
- Poll cue
- Q&A cue
- Sponsor mention
- Responsible crew
- Client approval status
- Readiness status
- Backup plan

### Production Tasks and Milestones

Routes:

- `/app/events/[eventId]/timeline`
- `/app/events/[eventId]/tasks`

Must show:

- Milestone timeline
- Task board
- Task status
- Priority
- Owner
- Due date
- Client-visible flag
- Linked resources

### Contractor Management

Routes:

- `/app/contractors`
- `/app/events/[eventId]/crew`
- `/crew`
- `/crew/events/[eventId]`

Must show:

- Contractor bench
- Event assignments
- Role
- Call time
- Assigned tasks
- Confirmation status

### Vendor Management

Routes:

- `/app/vendors`
- `/app/events/[eventId]/vendors`

Must show:

- Vendor directory
- Service category
- Contact
- Assigned event
- Deliverables
- Due dates
- Status

### Speaker Onboarding

Routes:

- `/app/events/[eventId]/speakers`
- `/speaker`
- `/speaker/events/[eventId]/onboarding`
- `/speaker/events/[eventId]/tech-check`
- `/speaker/events/[eventId]/backstage`

Readiness states:

- Invited
- Confirmed
- Bio submitted
- Headshot submitted
- Deck submitted
- Release signed
- Tech check scheduled
- Tech check completed
- Ready

### Sponsor and Expo Management

Routes:

- `/app/events/[eventId]/sponsors`
- `/sponsor`
- `/sponsor/events/[eventId]/booth`
- `/sponsor/events/[eventId]/leads`
- `/sponsor/events/[eventId]/report`
- `/venue/[eventId]/expo`
- `/venue/[eventId]/expo/[boothId]`

Must show:

- Sponsor list
- Tier
- Booth readiness
- CTA
- Resources
- Representatives
- Lead report operational surface

### Client Approval Portal

Routes:

- `/client/[clientSlug]`
- `/client/[clientSlug]/events/[eventId]`
- `/client/[clientSlug]/events/[eventId]/approvals`
- `/client/[clientSlug]/events/[eventId]/timeline`
- `/client/[clientSlug]/events/[eventId]/run-of-show`
- `/client/[clientSlug]/events/[eventId]/assets`
- `/client/[clientSlug]/events/[eventId]/reports`

Must not show:

- Internal notes
- Contractor rates
- Vendor costs
- Agency margin
- Private risk notes

### Production Command Center

Route:

- `/app/events/[eventId]/producer`

Must show:

- Current run-of-show segment
- Next three cues
- Speaker readiness
- Stage status
- Room status
- Crew status
- Incident log
- Chat/Q&A/poll operational surfaces
- Recording status
- Client observer notes

### Public Event and Venue Shell

Public routes:

- `/`
- `/events/[slug]`
- `/events/[slug]/register`
- `/events/[slug]/agenda`
- `/events/[slug]/speakers`
- `/events/[slug]/sponsors`

Venue routes:

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

## 8. Required Shared Components

- AppShell
- Sidebar
- Topbar
- PageHeader
- StatusBadge
- RoleBadge
- EventLifecycleBadge
- ReadinessScore
- ApprovalStatusBadge
- TaskStatusBadge
- EmptyState
- LoadingState
- ErrorState
- MetricCard
- TimelineItem
- AuditLogTimeline
- ModuleCard
- RiskBadge
- LinkedRecordBadge

## 9. Required Seeded Data

Seeded data must include:

- One agency: West Peek Productions
- At least three clients
- At least five events
- Event types: virtual summit, webinar, demo day, sponsor expo, paid workshop
- Agency team
- Contractors
- Vendors
- Speakers
- Sponsors
- Sponsor booths
- Run-of-show segments
- Tasks/milestones
- Assets
- Approvals
- Analytics events
- Audit logs

## 10. Acceptance Criteria

The MVP is acceptable when:

- Agency dashboard is usable with seeded data.
- Clients and events are visible.
- Event overview shows readiness and blockers.
- Run-of-show exists as structured UI.
- Tasks/milestones exist.
- Contractor/vendor assignments exist.
- Speaker/sponsor onboarding exists.
- Client approval portal exists.
- Production command center exists.
- Venue shell exists.
- Reporting shell exists.
- Permissions are centralized.
- Seeded data is separated.
- Core docs exist.
- Known shortcuts are listed.

## 11. Failure Conditions

The MVP fails if:

- It behaves like only a virtual event app.
- It ignores agency workflows.
- It lacks multi-client structure.
- It lacks readiness scoring.
- It lacks run-of-show structure.
- It exposes internal data to client routes.
- It hard-codes video provider logic.
- It scatters role checks across components.
- It has no technical debt register.

## 12. First Baseline Output

Recommended artifact name:

`agency-event-os-main_BASELINE_05-18-26_v001.zip`

Required root contents:

- `package.json`
- `README.md`
- `.env.example`
- `.gitignore`
- `docs/`
- `app/`
- `components/`
- `lib/`
- `services/`
- `types/`
- `db/`
- `tests/`
- `scripts/`
