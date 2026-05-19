import type { EmailWorkflowPayload } from "@/types/emailWorkflows";
import { buildEmailSubject } from "./emailWorkflowTemplates";

export function buildEmailWorkflowPayload(input: EmailWorkflowPayload) {
  return {
    ...input,
    subject: buildEmailSubject(input),
    summary: input.summary ?? `${input.workflowType.replace(/_/g, " ")} for ${input.eventName ?? "event"}`,
  };
}

export function renderEmailWorkflowText(payload: EmailWorkflowPayload) {
  const normalized = buildEmailWorkflowPayload(payload);
  const greeting = normalized.recipientName ? `Hi ${normalized.recipientName},` : "Hi,";
  const due = normalized.dueAt ? `\nDue: ${normalized.dueAt}` : "";
  const action = normalized.actionUrl ? `\nOpen: ${normalized.actionUrl}` : "";
  return `${greeting}\n\n${normalized.summary}${due}${action}\n\nAgency Event OS`;
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
