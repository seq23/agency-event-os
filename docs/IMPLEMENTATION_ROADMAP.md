# Agency Event OS — Implementation Roadmap

## 1. Purpose

This document defines the step-by-step build roadmap for Agency Event OS.

It exists so ChatGPT, Codex, future contributors, and the project owner can build the product in a controlled sequence without turning the app into a fragile demo or an overbuilt enterprise platform too early.

The roadmap follows the current product lock:

**Agency Event OS = Hopin-style virtual event venue + agency production operating system.**

The agency production operating system is the priority. The virtual venue is required, but it is one layer of the product, not the whole product.

## 2. Roadmap Principles

1. Build docs before code.
2. Build architecture before UI sprawl.
3. Build types before components.
4. Build permissions before protected routes.
5. Build mock data before persistence.
6. Build agency workflows before attendee venue polish.
7. Build video abstraction before real video integration.
8. Build shell workflows before real integrations.
9. Build repo artifacts in batches.
10. Package every meaningful baseline as a ZIP.

## 3. Current Status

Completed documentation baseline:

1. `AGENCY_EVENT_OS_PRODUCT_SPEC.md`
2. `AGENCY_EVENT_OS_MVP_SCOPE.md`
3. `AGENCY_EVENT_OS_USER_ROLES_AND_PERMISSIONS.md`
4. `AGENCY_EVENT_OS_DATABASE_SCHEMA.md`
5. `AGENCY_EVENT_OS_ROUTE_MAP.md`

This document is Step 6.

## 4. Phase Overview

| Phase | Name | Output |
|---|---|---|
| Phase 0 | Documentation Baseline | Source-of-truth docs |
| Phase 1 | Repo Skeleton | Empty structured app repo |
| Phase 2 | Core Types + Permissions + Mock Data | Domain layer |
| Phase 3 | App Shell + Navigation | Base UI shell |
| Phase 4 | Agency Dashboard | Owner command surface |
| Phase 5 | Client + Event Management | Agency operations core |
| Phase 6 | Readiness + Run-of-Show + Tasks | Production planning core |
| Phase 7 | Contractors + Vendors + Speakers + Sponsors | External coordination layer |
| Phase 8 | Client Portal + Approvals + Assets | Client-facing operating layer |
| Phase 9 | Production Command Center | Live show cockpit |
| Phase 10 | Public Event + Venue Shell | Hopin-style attendee layer |
| Phase 11 | Analytics + Reporting | Post-event proof layer |
| Phase 12 | Documentation + Tests + Debt Register | Hardening baseline |
| Phase 13 | Starter Baseline ZIP | GitHub-ready artifact |
| Phase 14 | Codex Handoff | Implementation hardening |

## 5. Phase 0 — Documentation Baseline

### Goal

Create the source-of-truth documentation package before app code is generated.

### Required Files

- `AGENCY_EVENT_OS_PRODUCT_SPEC.md`
- `AGENCY_EVENT_OS_MVP_SCOPE.md`
- `AGENCY_EVENT_OS_USER_ROLES_AND_PERMISSIONS.md`
- `AGENCY_EVENT_OS_DATABASE_SCHEMA.md`
- `AGENCY_EVENT_OS_ROUTE_MAP.md`
- `AGENCY_EVENT_OS_IMPLEMENTATION_ROADMAP.md`

### Completion Criteria

- Product identity is clear.
- MVP boundary is explicit.
- Roles and permissions are defined.
- Database schema is production-intent.
- Route map is audience-separated.
- Build sequence is locked.

### Status

Complete once this file is created.

## 6. Phase 1 — Repo Skeleton

### Goal

Create the initial Next.js-ready repository structure.

### Target Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui-compatible component structure
- Supabase-ready architecture
- Zod-ready validation
- React Hook Form-ready forms
- Playwright-ready E2E tests
- Vitest-ready unit tests

### Required Root Files

- `README.md`
- `package.json`
- `tsconfig.json`
- `next.config.js`
- `tailwind.config.ts`
- `postcss.config.js`
- `.env.example`
- `.gitignore`

### Required Directories

```txt
app/
components/
lib/
services/
types/
db/
docs/
tests/
scripts/
```

### Required App Route Groups

```txt
app/
  (public)/
  (auth)/
  app/
  client/
  crew/
  speaker/
  sponsor/
  venue/
```

### Required Component Groups

```txt
components/
  layout/
  navigation/
  dashboard/
  clients/
  events/
  run-of-show/
  production/
  tasks/
  approvals/
  assets/
  speakers/
  sponsors/
  contractors/
  vendors/
  venue/
  analytics/
  shared/
```

### Required Library Groups

```txt
lib/
  auth/
  permissions/
  readiness/
  audit/
  mock/
  supabase/
  validation/
  utils/
```

### Required Service Groups

```txt
services/
  agencies/
  clients/
  events/
  production/
  run-of-show/
  approvals/
  video/
  networking/
  analytics/
  audit/
```

### Completion Criteria

- Repo opens as a coherent project.
- Root structure is clear.
- Docs are included.
- No app logic is required yet.
- No real Supabase/video integration is required yet.

## 7. Phase 2 — Core Types, Permissions, and Mock Data

### Goal

Create the domain language that the whole app uses.

### Required Files

```txt
types/core.ts
types/permissions.ts
types/readiness.ts
types/audit.ts
lib/permissions/roles.ts
lib/permissions/capabilities.ts
lib/permissions/can.ts
lib/permissions/index.ts
lib/mock/mockData.ts
lib/mock/getMockData.ts
```

### Core Type Coverage

Must include:

- Agency
- AgencyMember
- Client
- ClientContact
- Event
- EventStatus
- EventType
- EventTemplate
- RunOfShowSegment
- ProductionTask
- Contractor
- Vendor
- SpeakerProfile
- Sponsor
- SponsorBooth
- Asset
- ApprovalRequest
- VideoRoom
- NetworkingMatch
- AnalyticsEvent
- AuditLog

### Permission Coverage

Must include:

- Role constants.
- Capability constants.
- `can(user, action, resource)` helper.
- Assigned-only access model.
- Client-facing visibility checks.
- Internal-only data restrictions.

### Mock Data Requirements

Must include:

- One agency: West Peek Productions.
- Three clients.
- Five events.
- Agency team.
- Contractors.
- Vendors.
- Speakers.
- Sponsors.
- Sponsor booths.
- Tasks.
- Milestones.
- Run-of-show segments.
- Assets.
- Approvals.
- Analytics events.
- Audit logs.

### Completion Criteria

- Types compile.
- Mock data uses realistic relationships.
- Permissions are centralized.
- No component should invent its own domain model later.

## 8. Phase 3 — App Shell and Navigation

### Goal

Create the visual and structural container for the app.

### Required Files

```txt
app/layout.tsx
app/page.tsx
app/app/layout.tsx
components/layout/AppShell.tsx
components/navigation/Sidebar.tsx
components/navigation/Topbar.tsx
components/shared/StatusBadge.tsx
components/shared/ReadinessScore.tsx
components/shared/EmptyState.tsx
components/shared/LoadingState.tsx
components/shared/ErrorState.tsx
lib/utils/cn.ts
```

### Requirements

- Premium SaaS look.
- Responsive layout.
- Agency owner orientation.
- Clear module navigation.
- Shared status components.
- Empty/loading/error primitives.

### Completion Criteria

- App shell renders.
- Navigation shows major sections.
- Shared components exist.
- App can be extended module by module.

## 9. Phase 4 — Agency Dashboard

### Goal

Build the primary command surface for the agency owner.

### Route

```txt
/app
```

### Required Components

```txt
AgencyDashboard
UpcomingEventsPanel
EventsAtRiskPanel
PendingApprovalsPanel
ContractorConfirmationsPanel
MissingAssetsPanel
ReportsDuePanel
ReadinessOverviewPanel
```

### Must Answer

- Which events are upcoming?
- Which events are at risk?
- Which approvals are blocking progress?
- Which contractors have not confirmed?
- Which assets are missing?
- Which reports are due?
- Which event needs attention first?

### Completion Criteria

- Dashboard renders from mock data.
- Agency-owner workflow is clearly central.
- Venue is not the main app framing.
- Readiness and blockers are visible.

## 10. Phase 5 — Client and Event Management

### Goal

Build the main agency operating layer.

### Routes

```txt
/app/clients
/app/clients/[clientId]
/app/events
/app/events/[eventId]/overview
/app/templates
```

### Required Components

```txt
ClientList
ClientCard
ClientDetailHeader
ClientContactsPanel
ClientEventsTable
ClientApprovalsPanel
ClientAssetsPanel
ClientReportsPanel
EventPortfolio
EventCard
EventOverview
EventReadinessBreakdown
EventLifecycleTimeline
EventTemplateLibrary
EventTemplateCard
```

### Completion Criteria

- Agency can see clients.
- Agency can see event portfolio.
- Event overview shows readiness and blockers.
- Template shell exists.
- Mock data relationships are coherent.

## 11. Phase 6 — Readiness, Run-of-Show, and Tasks

### Goal

Build the production planning core.

### Routes

```txt
/app/events/[eventId]/run-of-show
/app/events/[eventId]/timeline
/app/events/[eventId]/tasks
```

### Required Files

```txt
lib/readiness/calculateEventReadiness.ts
components/run-of-show/RunOfShowPage.tsx
components/run-of-show/RunOfShowTimeline.tsx
components/run-of-show/RunOfShowSegmentCard.tsx
components/run-of-show/RunOfShowSegmentEditorShell.tsx
components/tasks/EventTimeline.tsx
components/tasks/TaskBoard.tsx
components/tasks/TaskCard.tsx
```

### Readiness Categories

- Event setup
- Client approvals
- Run-of-show
- Speakers
- Sponsors
- Contractors/crew
- Vendors
- Assets
- Venue configuration
- Rehearsal readiness
- Reporting setup

### Completion Criteria

- Readiness score calculates from mock data.
- Run-of-show is structured, not a plain note.
- Tasks connect to production resources.
- Client-visible flags exist in task/run-of-show mock data.

## 12. Phase 7 — Contractors, Vendors, Speakers, and Sponsors

### Goal

Build external contributor coordination.

### Routes

```txt
/app/contractors
/app/vendors
/app/events/[eventId]/crew
/app/events/[eventId]/vendors
/app/events/[eventId]/speakers
/app/events/[eventId]/sponsors
/crew
/crew/events/[eventId]
/speaker
/speaker/events/[eventId]/onboarding
/sponsor
/sponsor/events/[eventId]/booth
```

### Required Modules

- Contractor bench.
- Contractor event assignments.
- Crew call sheet.
- Vendor directory.
- Vendor deliverables.
- Speaker readiness grid.
- Speaker onboarding portal.
- Sponsor readiness grid.
- Sponsor booth editor shell.
- Sponsor deliverables checklist.

### Completion Criteria

- Contractors see assigned work only in shell.
- Vendors see assigned deliverables only in shell.
- Speakers have own onboarding shell.
- Sponsors have own booth/report shell.
- Agency can manage readiness for all.

## 13. Phase 8 — Client Portal, Approvals, and Assets

### Goal

Build the client-facing operating layer.

### Routes

```txt
/client/[clientSlug]
/client/[clientSlug]/events/[eventId]
/client/[clientSlug]/events/[eventId]/approvals
/client/[clientSlug]/events/[eventId]/timeline
/client/[clientSlug]/events/[eventId]/run-of-show
/client/[clientSlug]/events/[eventId]/assets
/client/[clientSlug]/events/[eventId]/reports
/app/events/[eventId]/approvals
/app/events/[eventId]/assets
```

### Required Components

```txt
ClientPortalDashboard
ClientApprovalQueue
ApprovalRequestCard
ApprovalCommentThreadShell
ClientFacingTimeline
ClientFacingRunOfShow
ClientAssetReview
ClientReportPreview
AssetLibrary
AssetCard
AssetTable
```

### Completion Criteria

- Client portal feels calm and polished.
- Internal agency notes are not rendered.
- Approval states are visible.
- Assets have status/version concepts.
- Agency can preview client-facing view.

## 14. Phase 9 — Production Command Center

### Goal

Build the live show cockpit.

### Route

```txt
/app/events/[eventId]/producer
```

### Required Components

```txt
ProductionCommandCenter
LiveSegmentPanel
NextCuesPanel
SpeakerReadinessPanel
RoomStatusPanel
CrewStatusPanel
IncidentLogPanel
ChatModerationQueue
QAPanel
PollControlPanel
RecordingStatusPanel
ClientObserverNotesPanel
```

### MVP Behavior

- Uses mock state.
- Buttons are non-functional placeholders.
- Shows live production layout.
- Uses current/next run-of-show segments.
- Displays speaker/room/crew readiness.

### Completion Criteria

- The page feels like a real show-control cockpit.
- Production users can see what is live now and what comes next.
- Incident log exists.
- Future video/chat/recording hooks are obvious.

## 15. Phase 10 — Public Event and Venue Shell

### Goal

Build the Hopin-style attendee-facing layer.

### Public Routes

```txt
/
/events/[slug]
/events/[slug]/register
/events/[slug]/agenda
/events/[slug]/speakers
/events/[slug]/sponsors
```

### Venue Routes

```txt
/venue/[eventId]/lobby
/venue/[eventId]/stage
/venue/[eventId]/sessions
/venue/[eventId]/sessions/[sessionId]
/venue/[eventId]/networking
/venue/[eventId]/expo
/venue/[eventId]/expo/[boothId]
/venue/[eventId]/people
/venue/[eventId]/replay
/venue/[eventId]/help
```

### Required Components

```txt
PublicEventPage
EventRegistrationShell
VenueShell
VenueNavigation
EventLobby
MainStagePage
SessionDirectory
SessionRoomPage
NetworkingPage
ExpoDirectory
ExpoBoothPage
PeopleDirectory
ReplayLibrary
ChatPanelShell
QAPanelShell
PollPanelShell
```

### Completion Criteria

- Venue shell is coherent.
- Main stage exists with video placeholder.
- Sessions exist.
- Networking shell exists.
- Expo booths connect to sponsor mock data.
- Chat/Q&A/polls are shells.
- Venue does not replace agency operating layer.

## 16. Phase 11 — Analytics and Reporting

### Goal

Build post-event proof-of-value layer.

### Routes

```txt
/app/events/[eventId]/analytics
/app/events/[eventId]/report
/client/[clientSlug]/events/[eventId]/reports
/sponsor/events/[eventId]/report
```

### Required Components

```txt
EventAnalyticsDashboard
RegistrationMetrics
AttendanceMetrics
SessionEngagementTable
SponsorPerformanceTable
NetworkingMetrics
ReplayMetrics
ClientReportBuilderShell
SponsorReportBuilderShell
ExportReportButton
```

### Mock Metrics

- Registrations
- Attendance
- Attendance by session
- Average watch time
- Replay views
- Chat activity
- Q&A activity
- Poll results
- Networking matches
- Networking connections
- Sponsor booth visits
- Sponsor leads
- CTA clicks
- Resource downloads
- Drop-off points
- Top sessions
- Attendee engagement score

### Completion Criteria

- Agency can show value after event.
- Client report shell exists.
- Sponsor report shell exists.
- Metrics are sourced from mock analytics events.

## 17. Phase 12 — Documentation, Tests, and Debt Register

### Goal

Complete the baseline hardening layer before packaging.

### Required Docs

```txt
docs/PRODUCT_SPEC.md
docs/MVP_SCOPE.md
docs/USER_ROLES_AND_PERMISSIONS.md
docs/DATABASE_SCHEMA.md
docs/ROUTE_MAP.md
docs/IMPLEMENTATION_ROADMAP.md
docs/COMPONENT_MAP.md
docs/RUN_OF_SHOW_MODEL.md
docs/PRODUCTION_COMMAND_CENTER.md
docs/CLIENT_PORTAL.md
docs/CONTRACTOR_VENDOR_MANAGEMENT.md
docs/SPEAKER_ONBOARDING.md
docs/SPONSOR_EXPO.md
docs/APPROVAL_WORKFLOWS.md
docs/ASSET_LIBRARY.md
docs/VIDEO_ARCHITECTURE.md
docs/SPEED_NETWORKING.md
docs/ANALYTICS_AND_REPORTING.md
docs/SECURITY_MODEL.md
docs/TEST_PLAN.md
docs/TECH_DEBT_REGISTER.md
```

### Required Tests

Initial tests may be minimal but should include:

- Permission helper tests.
- Readiness scoring tests.
- Mock data integrity test.
- Route map smoke test if practical.
- Build/lint/typecheck scripts.

### Required Tech Debt Register Entries

- Mock data only.
- No production auth.
- No Supabase persistence.
- No real uploads.
- No real video provider.
- No real payments.
- No real email notifications.
- No real chat persistence.
- No real analytics ingestion.
- No real report export.
- No drag-and-drop run-of-show editing.
- No contractor payment workflow.
- No full vendor portal.

### Completion Criteria

- Every shortcut is documented.
- Tests exist for critical logic where possible.
- Docs match actual generated structure.

## 18. Phase 13 — Starter Baseline ZIP

### Goal

Package a GitHub-ready baseline artifact.

### Artifact Name

```txt
agency-event-os-main_BASELINE_05-18-26_v001.zip
```

### Required Root Contents

```txt
README.md
package.json
.env.example
.gitignore
docs/
app/
components/
lib/
services/
types/
db/
tests/
scripts/
```

### Structural Checks

Before delivery:

- ZIP opens.
- Root files exist.
- No accidental wrapper folder issue.
- Docs exist.
- App directories exist.
- Package scripts exist.
- Mock data exists.
- Expected files exist.

### Status Label

If no local build validation has run:

```txt
STRUCTURALLY CHECKED — LOCAL VALIDATION REQUIRED
```

## 19. Phase 14 — Codex Handoff

### Goal

Use Codex to harden and implement beyond the mock shell.

### Codex First Prompt

```txt
Audit this repository for Agency Event OS.

The source of truth is the /docs folder.

Do not modify files yet.

Evaluate:
- Whether the current code matches /docs/PRODUCT_SPEC.md
- Whether the route structure matches /docs/ROUTE_MAP.md
- Whether permissions match /docs/USER_ROLES_AND_PERMISSIONS.md
- Whether types match /docs/DATABASE_SCHEMA.md
- Whether the agency-owner workflow is central
- Whether the virtual venue is implemented as one layer of the product, not the entire product
- Whether mock data is clearly separated from future production data
- Whether video provider logic is properly abstracted
- Whether technical debt is documented

Return:
1. Architecture summary
2. Gaps
3. Critical issues
4. High-priority fixes
5. Medium-priority fixes
6. Recommended implementation order
7. Files to change
8. Tests to add

Do not write code yet.
```

### Codex Implementation Order

1. Repo audit.
2. Type/schema cleanup.
3. Permission tests.
4. Readiness scoring tests.
5. Route consistency cleanup.
6. Mock data normalization.
7. Supabase schema generation.
8. Auth integration.
9. Agency/client/event persistence.
10. Approval workflow persistence.
11. Run-of-show persistence.
12. Contractor/vendor persistence.
13. Speaker/sponsor persistence.
14. Venue data persistence.
15. Video provider integration.
16. Networking engine.
17. Analytics events.
18. Report generation.
19. CI/build/test hardening.
20. Deployment.

## 20. Stop Conditions

Stop and repair if:

- Agency owner workflow disappears.
- App becomes only an attendee venue.
- Client/internal data boundaries blur.
- Contractors/vendors can see too much.
- Speaker/sponsor portals are skipped.
- Run-of-show becomes unstructured notes.
- Production command center is missing.
- Video provider logic is hard-coded too early.
- Mock data does not map to schema.
- Route map and app routes diverge.
- Tech debt is hidden instead of recorded.

## 21. Final Roadmap Principle

Build the operating system first. Build the venue around it.

The first baseline must prove that an agency owner can manage multiple client events without rebuilding the same production machine every time.


## Batch 3A — Supabase Auth + Real Current User

Real Supabase Auth session resolution, profile lookup, role-access normalization, route protection, and auth forms. CRUD/uploads/email/video remain deferred.
