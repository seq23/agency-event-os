<!-- ARCHIVED: superseded by active runbooks / ledgers. See docs/archive/ARCHIVE_INDEX.md and docs/DOCS_CONSOLIDATION_MAP.md. -->

# West Peek Live! — Product Spec

## 1. Product Identity

**Working name:** West Peek Live!  
**Category:** Multi-client virtual event production platform for agencies.

West Peek Live! combines a Hopin-style virtual event venue with an agency production operating system. It is not just where attendees watch sessions. It is the system an agency owner uses to plan, sell, coordinate, produce, run, report on, and repeat virtual events for multiple clients.

## 2. Positioning

**Positioning statement:** West Peek Live! helps agencies plan, produce, run, and report on virtual events for multiple clients from one production command center.

The platform gives agencies one place to manage clients, event packages, speakers, sponsors, contractors, vendors, assets, approvals, run-of-show, live show control, attendee experience, and post-event reporting.

## 3. Strategic Thesis

Most virtual event platforms focus on the venue: main stage, sessions, networking, expo, chat, and replays.

Agency owners need the operational layer around the event:

- Multiple clients
- Multiple events
- Multiple speakers
- Multiple sponsors
- Multiple contractors
- Multiple vendors
- Multiple approval paths
- Multiple assets and versions
- Multiple live production risks
- Multiple post-event deliverables

The moat is not only the virtual room. The moat is the production operating system around the event.

## 4. Primary Buyer

The primary buyer is an agency owner, executive producer, or production operator who sells and runs virtual events for clients.

They may produce:

- Virtual summits
- Webinars
- Workshops
- Course launches
- Investor demo days
- Online conferences
- Sponsor expos
- Executive roundtables
- Community events
- Internal client town halls

## 5. Core Product Promise

West Peek Live! helps the agency owner:

1. Create repeatable client event systems.
2. Keep clients calm and informed.
3. Keep contractors and vendors aligned.
4. Keep speakers and sponsors ready.
5. Run the live show from a command center.
6. Produce polished reports after the event.
7. Convert successful events into reusable templates.

## 6. Product Layers

### Layer 1 — Agency Workspace

- Agency dashboard
- Client list
- Event portfolio
- Agency team
- Contractor bench
- Vendor directory
- Event templates
- Assets
- Reports
- Settings

### Layer 2 — Client Workspace

- Client overview
- Events
- Pending approvals
- Timeline
- Client-facing run-of-show
- Assets requested
- Event links
- Reports
- Approval history

### Layer 3 — Event Builder

- Client
- Event name
- Event type
- Package/template
- Date/time/time zone
- Branding
- Registration
- Agenda
- Main stage
- Breakouts
- Networking
- Expo/sponsors
- Speakers
- Crew
- Vendors
- Replay/reporting settings

### Layer 4 — Production Planning

- Milestones
- Tasks
- Run-of-show
- Speaker onboarding
- Sponsor onboarding
- Contractor assignments
- Vendor assignments
- Asset collection
- Client approvals
- Tech checks
- Rehearsal planning
- Readiness scoring

### Layer 5 — Virtual Venue

- Public event page
- Registration
- Attendee lobby
- Main stage
- Breakout/session rooms
- Speed networking
- Expo booths
- People directory
- Chat
- Q&A
- Polls
- Replays
- Help/support

### Layer 6 — Production Command Center

- Current run-of-show segment
- Next cues
- Speaker readiness
- Stage status
- Room status
- Crew status
- Incident log
- Moderation queue
- Q&A queue
- Poll controls
- Recording status
- Client observer notes

### Layer 7 — Reporting and Reuse

- Attendance analytics
- Engagement analytics
- Session performance
- Sponsor performance
- Networking activity
- Replay views
- Client reports
- Sponsor reports
- CSV exports
- Event post-mortem
- Save as template

## 7. Personas

### Agency Owner / Executive Producer

Needs broad visibility across clients, events, risk, approvals, contractors, vendors, reports, and template reuse.

### Project Manager

Needs tasks, timeline, assets, approvals, speaker/sponsor follow-up, and deliverable coordination.

### Technical Director

Needs stage/room setup, video readiness, tech checks, backstage/rehearsal links, and technical cues.

### Moderator

Needs chat, Q&A, polls, incident escalation, and assigned-room moderation tools.

### Contractor

Needs assigned tasks, call time, assigned run-of-show segments, relevant assets, and limited notes.

### Vendor

Needs assigned deliverables, due dates, upload/request details, and agency contact.

### Client Owner / Reviewer

Needs a polished approval portal, timeline, event links, assets, comments, and final reports.

### Speaker

Needs onboarding, profile submission, headshot/deck upload, release status, tech check, and backstage link.

### Sponsor Admin / Representative

Needs booth setup, resources, CTA, reps, leads, sponsor report, and booth participation details.

### Attendee

Needs simple registration, venue navigation, sessions, networking, expo, chat, Q&A, polls, and replays.

## 8. Core Workflows

### Agency Creates Client

1. Create client record.
2. Add contacts.
3. Add brand assets.
4. Set portal visibility defaults.
5. Create first event or import event template.

### Agency Creates Event from Template

1. Select client.
2. Choose event type/package/template.
3. Set date/time/time zone.
4. Generate event structure, tasks, run-of-show, and rooms.
5. Assign producer/project manager.
6. Open production dashboard.
7. Publish client portal when ready.

### Client Approval Workflow

1. Agency sends item for approval.
2. Client reviews in portal.
3. Client approves or requests changes.
4. Agency receives status update.
5. Approval history is preserved.
6. Approved items can be locked.

### Live Production Workflow

1. Producer opens command center.
2. Reviews current segment.
3. Confirms speaker readiness.
4. Checks stage/room status.
5. Runs cues, Q&A, chat, polls, and incidents.
6. Ends event and moves to replay/reporting.

### Post-Event Workflow

1. Process recordings.
2. Publish replay page.
3. Compile analytics.
4. Export sponsor leads.
5. Generate client report.
6. Generate sponsor reports.
7. Close contractors/vendors.
8. Capture post-mortem.
9. Save reusable template.

## 9. MVP Scope Summary

MVP must demonstrate:

- Multi-client agency structure
- Agency dashboard
- Client and event management
- Event readiness
- Run-of-show
- Tasks/milestones
- Contractors/vendors
- Speakers/sponsors
- Client approvals
- Production command center
- Venue shell
- Reporting shell
- Permissions
- Seeded data
- Documentation

## 10. Post-MVP Scope

- Real video provider integration
- Raw WebRTC
- Paid ticketing
- Stripe billing
- Production auth
- Native mobile apps
- Enterprise SSO
- AI matchmaking
- Advanced replay editing
- Automated contractor payments
- Custom domains
- Full email marketing suite

## 11. Technical Principles

- Agency owner workflow stays central.
- Venue is one layer, not the whole product.
- Multi-client architecture from day one.
- Every major record belongs to agency/client/event where appropriate.
- Internal and client-facing data are separated.
- Contractors/vendors only see assigned work.
- Run-of-show is a first-class object.
- Production command center is a first-class object.
- Every event has readiness scoring.
- Every admin action is audit-loggable.
- Video provider logic stays abstracted.
- Seeded data is clearly separated from production data.
- Every shortcut goes into the technical debt register.

## 12. Final Product Principle

West Peek Live! should make an agency owner feel like every client event has a cockpit, a checklist, a venue, a crew plan, a client portal, and a report — all connected.
