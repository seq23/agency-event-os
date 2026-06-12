<!-- ARCHIVED: superseded by active runbooks / ledgers. See docs/archive/ARCHIVE_INDEX.md and docs/DOCS_CONSOLIDATION_MAP.md. -->

# West Peek Live! — Route Map

## 1. Purpose

This document defines the first route map for West Peek Live!.

The route map is designed to support:

- Public event discovery and registration
- Agency internal operations
- Client portals
- Contractor/crew portals
- Speaker portals
- Sponsor portals
- Attendee venue experience
- Reporting and analytics

Routes are organized by audience and permission boundary.

## 2. Route Principles

1. Agency routes live under `/app`.
2. Client-facing routes live under `/client`.
3. Contractor/crew routes live under `/crew`.
4. Speaker routes live under `/speaker`.
5. Sponsor routes live under `/sponsor`.
6. Attendee venue routes live under `/venue`.
7. Public event marketing routes live under `/events`.
8. Internal data must not leak into client/sponsor/speaker/attendee routes.
9. Production command center is agency-side only.
10. Every route should have loading, empty, and error states.

## 3. Public Routes

### `/`

Purpose: marketing homepage for West Peek Live! or demo landing.

Primary user: public visitor / buyer.

Key components:

- MarketingHomePage
- HeroSection
- FeatureGrid
- AgencyWorkflowSection
- VenueFeatureSection
- CTASection

Permissions:

- Public

States:

- Standard marketing page
- No auth required

### `/events/[slug]`

Purpose: public event landing page.

Primary user: prospective attendee.

Key components:

- PublicEventPage
- EventHero
- PublicAgendaPreview
- PublicSpeakerList
- PublicSponsorList
- RegisterCTA

Permissions:

- Public if event is published
- Private/invite logic later

States:

- Event not found
- Event unpublished
- Registration closed
- Registration open

### `/events/[slug]/register`

Purpose: event registration shell.

Primary user: attendee.

Key components:

- EventRegistrationShell
- TicketTypeSelector
- RegistrationForm
- RegistrationConfirmationShell

Permissions:

- Public or invite-token depending on event access mode

States:

- Registration closed
- Event full
- Waitlist enabled
- Success
- Error

### `/events/[slug]/agenda`

Purpose: public agenda.

Primary user: attendee/prospect.

Key components:

- PublicAgenda
- AgendaItemCard
- SpeakerMiniCard

Permissions:

- Public or registered-only depending on event settings

### `/events/[slug]/speakers`

Purpose: public speaker list.

Primary user: attendee/prospect.

Key components:

- PublicSpeakerList
- SpeakerCard
- SpeakerProfileModal

### `/events/[slug]/sponsors`

Purpose: public sponsor list.

Primary user: attendee/prospect.

Key components:

- PublicSponsorList
- SponsorTierSection
- SponsorCard

## 4. Auth Routes

### `/login`

Purpose: user login.

Components:

- LoginForm
- MagicLinkForm
- PasswordLoginForm

### `/signup`

Purpose: account creation.

Components:

- SignupForm
- AgencyCreatePrompt

### `/forgot-password`

Purpose: password reset.

Components:

- ForgotPasswordForm

### `/accept-invite`

Purpose: accept agency/client/speaker/sponsor/contractor invite.

Components:

- InviteAcceptancePage
- InviteSummary
- AccountSetupForm

## 5. Agency Routes

### `/app`

Purpose: agency owner dashboard.

Primary user: Agency Owner, Agency Admin, Executive Producer.

Key components:

- AgencyDashboard
- UpcomingEventsPanel
- EventsAtRiskPanel
- PendingApprovalsPanel
- ContractorConfirmationsPanel
- MissingAssetsPanel
- ReportsDuePanel
- ReadinessOverviewPanel

Permissions:

- agency.view_dashboard

States:

- No clients yet
- No events yet
- Loading dashboard
- Error loading dashboard

### `/app/clients`

Purpose: client list.

Primary user: agency-side users.

Components:

- ClientList
- ClientCard
- ClientFilters
- CreateClientButton

Permissions:

- client.view
- client.create for create button

### `/app/clients/[clientId]`

Purpose: client detail workspace.

Components:

- ClientDetailHeader
- ClientContactsPanel
- ClientEventsTable
- ClientApprovalsPanel
- ClientAssetsPanel
- ClientReportsPanel

Permissions:

- client.view

States:

- Client not found
- Access denied
- No events
- No approvals

### `/app/events`

Purpose: event portfolio across clients.

Components:

- EventPortfolio
- EventCard
- EventFilters
- EventStatusBadge
- ReadinessScore

Permissions:

- event.view

### `/app/events/[eventId]/overview`

Purpose: event command overview.

Components:

- EventOverview
- EventReadinessBreakdown
- EventLifecycleTimeline
- EventBlockingItems
- EventModuleLinks
- EventProductionSummary

Permissions:

- event.view
- event.view_readiness

### `/app/templates`

Purpose: event template library.

Components:

- EventTemplateLibrary
- EventTemplateCard
- EventTemplatePreview

Permissions:

- event_template.view
- event_template.create later

### `/app/contractors`

Purpose: contractor bench.

Components:

- ContractorBench
- ContractorProfileCard
- ContractorFilters

Permissions:

- contractor.view

### `/app/vendors`

Purpose: vendor directory.

Components:

- VendorDirectory
- VendorProfileCard
- VendorFilters

Permissions:

- vendor.view

### `/app/assets`

Purpose: global agency asset library.

Components:

- AssetLibrary
- AssetTable
- AssetCard
- AssetFilters

Permissions:

- asset.view

### `/app/reports`

Purpose: agency report center.

Components:

- ReportsDashboard
- ClientReportList
- SponsorReportList
- EventReportList

Permissions:

- analytics.view_event
- analytics.view_client_report

### `/app/settings`

Purpose: agency settings.

Components:

- AgencySettings
- TeamMembersSettings
- BrandingSettings
- PermissionsSettings

Permissions:

- agency.manage_settings

## 6. Event Admin Routes

### `/app/events/[eventId]/builder`

Purpose: event builder.

Components:

- EventBuilder
- EventBasicsForm
- EventBrandingForm
- RegistrationSettingsForm
- VenueSettingsForm
- ReportingSettingsForm

Permissions:

- event.edit
- event.manage_settings

### `/app/events/[eventId]/timeline`

Purpose: milestone timeline.

Components:

- EventTimeline
- MilestoneList
- MilestoneCard

Permissions:

- task.view

### `/app/events/[eventId]/tasks`

Purpose: production task board.

Components:

- TaskBoard
- TaskCard
- TaskFilters
- TaskDetailDrawer

Permissions:

- task.view
- task.create/edit based on role

### `/app/events/[eventId]/run-of-show`

Purpose: run-of-show builder.

Components:

- RunOfShowPage
- RunOfShowTimeline
- RunOfShowSegmentCard
- RunOfShowSegmentEditorShell
- RunOfShowCueList
- RunOfShowReadinessPanel
- ExportRunOfShowButton

Permissions:

- run_of_show.view
- run_of_show.edit for editing

### `/app/events/[eventId]/crew`

Purpose: crew and contractor assignments.

Components:

- ContractorAssignmentBoard
- CrewCallSheet
- CrewRoleSummary

Permissions:

- contractor.assign
- contractor.view

### `/app/events/[eventId]/vendors`

Purpose: event vendor assignments.

Components:

- VendorAssignmentBoard
- VendorDeliverablesList

Permissions:

- vendor.assign
- vendor.view

### `/app/events/[eventId]/speakers`

Purpose: speaker management.

Components:

- SpeakerManager
- SpeakerReadinessGrid
- SpeakerProfileFormShell
- SpeakerAssetChecklist
- SpeakerTechCheckSchedulerShell

Permissions:

- speaker.view
- speaker.manage_onboarding

### `/app/events/[eventId]/sponsors`

Purpose: sponsor management.

Components:

- SponsorManager
- SponsorReadinessGrid
- SponsorDeliverablesChecklist
- SponsorBoothEditorShell

Permissions:

- sponsor.view
- sponsor.manage_booth

### `/app/events/[eventId]/approvals`

Purpose: approval management.

Components:

- ApprovalQueue
- ApprovalRequestCard
- ApprovalCommentThreadShell

Permissions:

- approval.view
- approval.create
- approval.comment

### `/app/events/[eventId]/assets`

Purpose: event asset library.

Components:

- AssetLibrary
- AssetTable
- AssetApprovalStatus
- AssetVersionBadge

Permissions:

- asset.view

### `/app/events/[eventId]/producer`

Purpose: production command center.

Components:

- ProductionCommandCenter
- LiveSegmentPanel
- NextCuesPanel
- SpeakerReadinessPanel
- RoomStatusPanel
- CrewStatusPanel
- IncidentLogPanel
- ChatModerationQueue
- QAPanel
- PollControlPanel
- RecordingStatusPanel
- ClientObserverNotesPanel

Permissions:

- production.view_command_center
- production.control_stage for controls
- production.log_incident for incident actions

Forbidden by default:

- Client users
- Contractors
- Vendors
- Speakers
- Sponsors
- Attendees
- Finance

### `/app/events/[eventId]/analytics`

Purpose: event analytics dashboard.

Components:

- EventAnalyticsDashboard
- RegistrationMetrics
- AttendanceMetrics
- SessionEngagementTable
- SponsorPerformanceTable
- NetworkingMetrics
- ReplayMetrics

Permissions:

- analytics.view_event

### `/app/events/[eventId]/report`

Purpose: client report builder shell.

Components:

- ClientReportBuilderShell
- ReportSectionEditorShell
- ExportReportButton

Permissions:

- analytics.view_client_report
- analytics.export

## 7. Client Portal Routes

### `/client/[clientSlug]`

Purpose: client portal dashboard.

Components:

- ClientPortalDashboard
- ClientEventsPanel
- ClientApprovalQueue
- ClientReportsPanel

Permissions:

- client.view_portal

### `/client/[clientSlug]/events/[eventId]`

Purpose: client event overview.

Components:

- ClientEventOverview
- ClientFacingTimeline
- ClientFacingSummary
- EventLinksPanel

Permissions:

- event.view_client_facing

### `/client/[clientSlug]/events/[eventId]/approvals`

Purpose: client approval queue.

Components:

- ClientApprovalQueue
- ApprovalRequestCard
- ApprovalCommentThreadShell

Permissions:

- approval.view
- approval.comment
- approval.approve for assigned users

### `/client/[clientSlug]/events/[eventId]/timeline`

Purpose: client-facing timeline.

Components:

- ClientFacingTimeline
- ClientMilestoneCard

Permissions:

- event.view_client_facing

### `/client/[clientSlug]/events/[eventId]/run-of-show`

Purpose: client-facing run-of-show.

Components:

- ClientFacingRunOfShow
- ClientRunOfShowSegment

Permissions:

- run_of_show.view_client_facing

### `/client/[clientSlug]/events/[eventId]/assets`

Purpose: client asset review.

Components:

- ClientAssetReview
- AssetCard
- ApprovalStatusBadge

Permissions:

- asset.view client-facing only

### `/client/[clientSlug]/events/[eventId]/reports`

Purpose: client report preview.

Components:

- ClientReportPreview
- ReportMetricCard
- ReportSection

Permissions:

- analytics.view_client_report

## 8. Contractor / Crew Routes

### `/crew`

Purpose: contractor portal dashboard.

Components:

- ContractorPortalDashboard
- ContractorAssignedEvents
- ContractorTaskList

Permissions:

- contractor.view_own_assignments

### `/crew/events/[eventId]`

Purpose: contractor event summary.

Components:

- CrewEventSummary
- CrewCallSheet
- AssignedSegmentsPanel

Permissions:

- contractor.view_own_assignments

### `/crew/events/[eventId]/tasks`

Purpose: contractor assigned tasks.

Components:

- ContractorTaskList
- ContractorTaskCard

Permissions:

- contractor.update_own_tasks

### `/crew/events/[eventId]/call-sheet`

Purpose: crew call sheet.

Components:

- CrewCallSheet
- CallTimeCard

Permissions:

- contractor.view_own_assignments

### `/crew/events/[eventId]/run-of-show`

Purpose: assigned run-of-show segments.

Components:

- CrewRunOfShowView
- AssignedRunOfShowSegment

Permissions:

- run_of_show.view assigned-only

## 9. Speaker Routes

### `/speaker`

Purpose: speaker portal dashboard.

Components:

- SpeakerPortalDashboard
- SpeakerAssignedEvents
- SpeakerReadinessCard

Permissions:

- speaker.view_own_portal

### `/speaker/events/[eventId]`

Purpose: speaker event overview.

Components:

- SpeakerEventOverview
- SpeakerSessionList

Permissions:

- speaker.view_own_portal

### `/speaker/events/[eventId]/onboarding`

Purpose: speaker onboarding.

Components:

- SpeakerProfileFormShell
- SpeakerAssetChecklist
- SpeakerReleaseStatus

Permissions:

- speaker.edit_own_profile

### `/speaker/events/[eventId]/tech-check`

Purpose: speaker tech check.

Components:

- SpeakerTechCheckSchedulerShell
- TechCheckStatusCard

Permissions:

- speaker.manage_tech_check own record

### `/speaker/events/[eventId]/backstage`

Purpose: backstage/join page.

Components:

- BackstageJoinCard
- SpeakerSessionInstructions

Permissions:

- speaker.view_own_portal

## 10. Sponsor Routes

### `/sponsor`

Purpose: sponsor portal dashboard.

Components:

- SponsorPortalDashboard
- SponsorAssignedEvents
- SponsorBoothStatus

Permissions:

- sponsor.view_own_booth

### `/sponsor/events/[eventId]`

Purpose: sponsor event overview.

Components:

- SponsorEventOverview
- SponsorDeliverablesChecklist

Permissions:

- sponsor.view_own_booth

### `/sponsor/events/[eventId]/booth`

Purpose: booth setup.

Components:

- SponsorBoothEditorShell
- BoothResourceManagerShell
- SponsorRepresentativeList

Permissions:

- sponsor.manage_booth

### `/sponsor/events/[eventId]/leads`

Purpose: sponsor lead table.

Components:

- SponsorLeadTableShell
- LeadExportButtonShell

Permissions:

- sponsor.view_own_leads

### `/sponsor/events/[eventId]/report`

Purpose: sponsor report.

Components:

- SponsorReportPreview
- SponsorPerformanceMetrics

Permissions:

- sponsor.view_reports own sponsor only

## 11. Venue Routes

### `/venue/[eventId]/lobby`

Purpose: attendee lobby.

Components:

- VenueShell
- VenueNavigation
- EventLobby
- LiveNowPanel
- UpcomingAgendaPanel
- SponsorHighlights

Permissions:

- venue.view

### `/venue/[eventId]/stage`

Purpose: main stage.

Components:

- MainStagePage
- LiveKitVideoSurface
- ChatPanelShell
- QAPanelShell
- PollPanelShell

Permissions:

- venue.join_stage

### `/venue/[eventId]/sessions`

Purpose: sessions directory.

Components:

- SessionDirectory
- SessionCard
- TrackFilter

Permissions:

- venue.view

### `/venue/[eventId]/sessions/[sessionId]`

Purpose: session room.

Components:

- SessionRoomPage
- LiveKitVideoSurface
- SessionChatPanelShell
- QAPanelShell

Permissions:

- venue.join_session

### `/venue/[eventId]/networking`

Purpose: speed networking.

Components:

- NetworkingPage
- NetworkingReadyCard
- NetworkingMatchCard
- NetworkingTimer
- ConnectSkipReportActions

Permissions:

- venue.join_networking

### `/venue/[eventId]/expo`

Purpose: expo directory.

Components:

- ExpoDirectory
- SponsorTierSection
- SponsorBoothCard

Permissions:

- venue.view_expo

### `/venue/[eventId]/expo/[boothId]`

Purpose: sponsor booth page.

Components:

- ExpoBoothPage
- BoothLiveKitVideoSurface
- BoothResourceList
- SponsorCTA
- LeadCaptureShell

Permissions:

- venue.view_expo

### `/venue/[eventId]/people`

Purpose: attendee directory.

Components:

- PeopleDirectory
- AttendeeCard
- PeopleSearch

Permissions:

- venue.view

### `/venue/[eventId]/replay`

Purpose: replay library.

Components:

- ReplayLibrary
- ReplayCard

Permissions:

- venue.view replay allowed by event status

### `/venue/[eventId]/help`

Purpose: attendee support.

Components:

- VenueHelpPage
- FAQPanel
- SupportContactCard

Permissions:

- venue.view

## 12. Route Acceptance Criteria

The route map is acceptable when:

- Every audience has a clear route area.
- Agency routes are separated from client, crew, speaker, sponsor, and attendee routes.
- Production command center is protected.
- Client portal renders client-facing data only.
- Contractor/vendor routes are assigned-only.
- Speaker/sponsor routes are own-record only.
- Venue routes are attendee-facing.
- Public event routes support pre-registration discovery.
- Every route has required components and permission assumptions.

## 13. Failure Conditions

The route map fails if:

- Client routes can render internal agency notes.
- Contractors can browse agency routes.
- Sponsors can see other sponsor leads.
- Speakers can see other speaker private data.
- Attendees can access admin routes.
- Venue routes become the whole product.
- Agency dashboard is not the primary operational home.

## Master Plan v4

V4 required routes: /join, /production-access, /production-access/crew, /production-access/special-guest, /app/events/[eventId]/setup, /publish, /video-health, /incidents.


## V5 gated routes
/app is crew/session only. /client, /speaker, /sponsor, /crew event portals require event-scoped role cookies. /venue remains public or VIP depending on event state.
