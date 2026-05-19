import type { EmailSendResult } from "./EmailProvider";
import type { EmailWorkflowPayload } from "@/types/emailWorkflows";
import type { EmailSendLog, ProductionEmailRequest } from "@/types/emailProduction";

export function buildEmailSendLog(input: {
  request: ProductionEmailRequest;
  result?: EmailSendResult;
  failureReason?: string;
}): EmailSendLog {
  const now = new Date().toISOString();
  const status = input.failureReason ? "failed" : input.result?.status ?? "queued";

  return {
    id: `email-log-${input.request.workflowType}-${Date.now()}`,
    agencyId: input.request.agencyId,
    clientId: input.request.clientId,
    eventId: input.request.eventId,
    workflowType: input.request.workflowType,
    recipientEmail: input.request.recipient.email,
    recipientName: input.request.recipient.name,
    subject: input.request.subject,
    provider: input.result?.provider ?? "resend",
    providerMessageId: input.result?.id,
    status,
    actionUrl: input.request.actionUrl,
    failureReason: input.failureReason,
    queuedAt: now,
    sentAt: status === "sent" ? now : undefined,
    failedAt: status === "failed" ? now : undefined,
  };
}

export function buildEmailWorkflowStatus(input: {
  agencyId: string;
  eventId: string;
  workflowType: EmailWorkflowPayload["workflowType"];
  enabled?: boolean;
  liveSendingEnabled?: boolean;
  lastSentAt?: string;
}) {
  return {
    agencyId: input.agencyId,
    eventId: input.eventId,
    workflowType: input.workflowType,
    enabled: input.enabled ?? true,
    liveSendingEnabled: input.liveSendingEnabled ?? true,
    lastSentAt: input.lastSentAt,
  };
}
