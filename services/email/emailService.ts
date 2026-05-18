import { isResendConfigured } from "@/lib/env";
import type { EmailMessage, EmailProvider, EmailSendResult } from "./EmailProvider";
import { MockEmailProvider } from "./MockEmailProvider";
import { ResendEmailProvider } from "./ResendEmailProvider";

export function createEmailProvider(): EmailProvider {
  if (isResendConfigured()) {
    return new ResendEmailProvider();
  }

  return new MockEmailProvider();
}

export async function sendEmail(message: EmailMessage, provider: EmailProvider = createEmailProvider()): Promise<EmailSendResult> {
  return provider.send(message);
}

export async function sendApprovalRequestedEmail(input: {
  to: string;
  eventName: string;
  approvalTitle: string;
  approvalUrl: string;
}) {
  return sendEmail({
    to: input.to,
    subject: `Approval requested: ${input.approvalTitle}`,
    html: `
      <h1>Approval requested</h1>
      <p>You have a new approval request for <strong>${input.eventName}</strong>.</p>
      <p><a href="${input.approvalUrl}">Review approval</a></p>
    `,
    text: `Approval requested for ${input.eventName}: ${input.approvalUrl}`,
  });
}
