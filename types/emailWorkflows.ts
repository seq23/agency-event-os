export type EmailWorkflowType =
  | "client_invite"
  | "speaker_invite"
  | "sponsor_setup_invite"
  | "contractor_assignment"
  | "approval_request"
  | "changes_requested"
  | "tech_check_reminder"
  | "asset_deadline_reminder"
  | "show_day_reminder"
  | "testing_failure_alert"
  | "report_ready";

export interface EmailWorkflowPayload {
  agencyId?: string;
  clientId?: string;
  eventId?: string;
  workflowType: EmailWorkflowType;
  to: string;
  subject: string;
  eventName?: string;
  recipientName?: string;
  actionUrl?: string;
  dueAt?: string;
  summary?: string;
}
