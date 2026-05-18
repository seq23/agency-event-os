import type { EmailWorkflowPayload } from "@/types/emailWorkflows";

export function buildEmailWorkflowPayload(input: EmailWorkflowPayload) {
  return {
    ...input,
    subject: input.subject.trim(),
    summary: input.summary ?? `${input.workflowType.replace(/_/g, " ")} for ${input.eventName ?? "event"}`,
  };
}

export function renderEmailWorkflowText(payload: EmailWorkflowPayload) {
  const greeting = payload.recipientName ? `Hi ${payload.recipientName},` : "Hi,";
  const due = payload.dueAt ? `\nDue: ${payload.dueAt}` : "";
  const action = payload.actionUrl ? `\nOpen: ${payload.actionUrl}` : "";
  return `${greeting}\n\n${payload.summary ?? payload.subject}${due}${action}\n\nAgency Event OS`;
}

export const requiredEmailWorkflows: EmailWorkflowPayload["workflowType"][] = [
  "client_invite",
  "speaker_invite",
  "sponsor_setup_invite",
  "contractor_assignment",
  "approval_request",
  "changes_requested",
  "tech_check_reminder",
  "asset_deadline_reminder",
  "show_day_reminder",
  "testing_failure_alert",
  "report_ready",
];
