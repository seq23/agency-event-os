import type { EmailWorkflowType } from "@/types/emailWorkflows";

export type EmailDeliveryStatus = "queued" | "sent" | "failed" | "skipped";

export interface ProductionEmailRecipient {
  email: string;
  name?: string;
}

export interface ProductionEmailRequest {
  agencyId?: string;
  clientId?: string;
  eventId?: string;
  workflowType: EmailWorkflowType;
  recipient: ProductionEmailRecipient;
  subject: string;
  html: string;
  text: string;
  actionUrl?: string;
  metadata?: Record<string, unknown>;
}

export interface EmailSendLog {
  id: string;
  agencyId?: string;
  clientId?: string;
  eventId?: string;
  workflowType: EmailWorkflowType;
  recipientEmail: string;
  recipientName?: string;
  subject: string;
  provider: "mock" | "resend";
  providerMessageId?: string;
  status: EmailDeliveryStatus;
  actionUrl?: string;
  failureReason?: string;
  queuedAt: string;
  sentAt?: string;
  failedAt?: string;
}

export interface EmailWorkflowStatus {
  agencyId: string;
  eventId: string;
  workflowType: EmailWorkflowType;
  enabled: boolean;
  liveSendingEnabled: boolean;
  lastSentAt?: string;
}
