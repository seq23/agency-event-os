export const CAPABILITIES = {
  AGENCY_VIEW_DASHBOARD: "agency.view_dashboard",
  AGENCY_MANAGE_SETTINGS: "agency.manage_settings",

  CLIENT_VIEW: "client.view",
  CLIENT_CREATE: "client.create",
  CLIENT_EDIT: "client.edit",
  CLIENT_VIEW_PORTAL: "client.view_portal",

  EVENT_VIEW: "event.view",
  EVENT_VIEW_INTERNAL: "event.view_internal",
  EVENT_VIEW_CLIENT_FACING: "event.view_client_facing",
  EVENT_CREATE: "event.create",
  EVENT_EDIT: "event.edit",
  EVENT_CHANGE_STATUS: "event.change_status",
  EVENT_VIEW_READINESS: "event.view_readiness",

  RUN_OF_SHOW_VIEW: "run_of_show.view",
  RUN_OF_SHOW_VIEW_INTERNAL: "run_of_show.view_internal",
  RUN_OF_SHOW_VIEW_CLIENT_FACING: "run_of_show.view_client_facing",
  RUN_OF_SHOW_EDIT: "run_of_show.edit",

  PRODUCTION_VIEW_COMMAND_CENTER: "production.view_command_center",
  PRODUCTION_CONTROL_STAGE: "production.control_stage",
  PRODUCTION_LOG_INCIDENT: "production.log_incident",

  TASK_VIEW: "task.view",
  TASK_CREATE: "task.create",
  TASK_EDIT: "task.edit",
  TASK_COMPLETE: "task.complete",

  ASSET_VIEW: "asset.view",
  ASSET_CREATE: "asset.create",
  ASSET_APPROVE: "asset.approve",

  APPROVAL_VIEW: "approval.view",
  APPROVAL_CREATE: "approval.create",
  APPROVAL_COMMENT: "approval.comment",
  APPROVAL_APPROVE: "approval.approve",

  SPEAKER_VIEW: "speaker.view",
  SPEAKER_MANAGE_ONBOARDING: "speaker.manage_onboarding",
  SPEAKER_VIEW_OWN_PORTAL: "speaker.view_own_portal",
  SPEAKER_EDIT_OWN_PROFILE: "speaker.edit_own_profile",

  SPONSOR_VIEW: "sponsor.view",
  SPONSOR_MANAGE_BOOTH: "sponsor.manage_booth",
  SPONSOR_VIEW_OWN_BOOTH: "sponsor.view_own_booth",
  SPONSOR_VIEW_OWN_LEADS: "sponsor.view_own_leads",
  SPONSOR_VIEW_REPORTS: "sponsor.view_reports",

  CONTRACTOR_VIEW: "contractor.view",
  CONTRACTOR_ASSIGN: "contractor.assign",
  CONTRACTOR_VIEW_OWN_ASSIGNMENTS: "contractor.view_own_assignments",
  CONTRACTOR_UPDATE_OWN_TASKS: "contractor.update_own_tasks",

  VENDOR_VIEW: "vendor.view",
  VENDOR_ASSIGN: "vendor.assign",
  VENDOR_VIEW_OWN_DELIVERABLES: "vendor.view_own_deliverables",

  VENUE_VIEW: "venue.view",
  VENUE_REGISTER: "venue.register",
  VENUE_JOIN_STAGE: "venue.join_stage",
  VENUE_JOIN_SESSION: "venue.join_session",
  VENUE_JOIN_NETWORKING: "venue.join_networking",
  VENUE_VIEW_EXPO: "venue.view_expo",
  VENUE_CHAT: "venue.chat",

  MODERATION_VIEW_QUEUE: "moderation.view_queue",
  MODERATION_DELETE_MESSAGE: "moderation.delete_message",

  ANALYTICS_VIEW_EVENT: "analytics.view_event",
  ANALYTICS_VIEW_CLIENT_REPORT: "analytics.view_client_report",
  ANALYTICS_VIEW_SPONSOR_REPORT: "analytics.view_sponsor_report",
  ANALYTICS_EXPORT: "analytics.export",

  FINANCE_VIEW: "finance.view",
  FINANCE_EDIT: "finance.edit",

  AUDIT_VIEW: "audit.view",
} as const;

export type Capability = typeof CAPABILITIES[keyof typeof CAPABILITIES];
