"use server";

import { buildProductionEmailRequest, sendProductionEmail } from "@/services/email";
import type { EmailWorkflowType } from "@/types/emailWorkflows";

export async function sendTestEmailAction(formData: FormData) {
  const to = String(formData.get("to") ?? "");
  const eventName = String(formData.get("eventName") ?? "West Peek Live!");
  const workflowType = String(formData.get("workflowType") ?? "client_invite") as EmailWorkflowType;

  if (!to.includes("@")) {
    return { ok: false, error: "A valid recipient email is required." };
  }

  const request = buildProductionEmailRequest({
    workflowType,
    to,
    subject: `Test email: ${eventName}`,
    eventName,
    recipientName: "Test recipient",
    summary: "This is a live Resend test from West Peek Live!.",
    actionUrl: "http://localhost:3000/app",
  });

  const { result, log } = await sendProductionEmail(request);

  return {
    ok: result.status === "sent",
    status: result.status,
    provider: result.provider,
    providerMessageId: result.id,
    failureReason: result.failureReason,
    log,
  };
}
