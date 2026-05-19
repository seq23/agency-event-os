import type { EmailWorkflowPayload, EmailWorkflowType } from "@/types/emailWorkflows";

const labels: Record<EmailWorkflowType, string> = {
  client_invite: "Client invite",
  speaker_invite: "Speaker invite",
  sponsor_setup_invite: "Sponsor setup invite",
  contractor_assignment: "Contractor assignment",
  approval_request: "Approval request",
  changes_requested: "Changes requested",
  tech_check_reminder: "Tech check reminder",
  asset_deadline_reminder: "Asset deadline reminder",
  show_day_reminder: "Show day reminder",
  testing_failure_alert: "Testing failure alert",
  report_ready: "Report ready",
};

export function buildEmailSubject(payload: EmailWorkflowPayload) {
  if (payload.subject.trim()) return payload.subject.trim();
  const event = payload.eventName ? `: ${payload.eventName}` : "";
  return `${labels[payload.workflowType]}${event}`;
}

export function renderEmailWorkflowHtml(payload: EmailWorkflowPayload) {
  const greeting = payload.recipientName ? `Hi ${payload.recipientName},` : "Hi,";
  const summary = payload.summary ?? `${labels[payload.workflowType]} for ${payload.eventName ?? "your event"}`;
  const due = payload.dueAt ? `<p><strong>Due:</strong> ${payload.dueAt}</p>` : "";
  const action = payload.actionUrl
    ? `<p><a href="${payload.actionUrl}" style="display:inline-block;background:#020617;color:#ffffff;padding:12px 16px;border-radius:10px;text-decoration:none;">Open task</a></p>`
    : "";

  return `
    <div style="font-family:Arial,sans-serif;line-height:1.5;color:#0f172a;">
      <p>${greeting}</p>
      <p>${summary}</p>
      ${due}
      ${action}
      <p style="color:#64748b;font-size:12px;">Agency Event OS</p>
    </div>
  `;
}

export function buildWorkflowPreview(payload: EmailWorkflowPayload) {
  return {
    subject: buildEmailSubject(payload),
    html: renderEmailWorkflowHtml(payload),
  };
}
