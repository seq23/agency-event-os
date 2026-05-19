import { getEventConfigPackage } from "@/services/events/eventConfigRepository";
import { sendEmail } from "@/services/email/emailService";
import { isResendConfigured } from "@/lib/env";
import { renderEventEmailTemplate } from "./emailTemplateRenderer";
import { recordEmailRuntimeEvent } from "./emailSendLogService";

export function getEventCommunicationReadiness(eventId: string) {
  const config = getEventConfigPackage(eventId);
  return {
    eventId: config.event.id,
    eventName: config.event.name,
    resendConfigured: isResendConfigured(),
    templates: config.communications.templates.map((templateKey) => ({
      templateKey,
      recipientSegment: templateKey.split("_")[0],
      ready: isResendConfigured(),
    })),
  };
}

export async function sendEventCommunication(input: { eventId: string; templateKey: string; to: string; recipientName?: string }) {
  const config = getEventConfigPackage(input.eventId);
  if (!isResendConfigured()) {
    return recordEmailRuntimeEvent({ eventId: config.event.id, templateKey: input.templateKey, recipientSegment: "manual", status: "blocked", reason: "Resend env is not configured." });
  }
  const rendered = renderEventEmailTemplate({ templateKey: input.templateKey, eventName: config.event.name, actionUrl: `/events/${config.event.slug}`, recipientName: input.recipientName });
  const result = await sendEmail({ to: input.to, subject: rendered.subject, html: rendered.html, text: rendered.text });
  return recordEmailRuntimeEvent({
    eventId: config.event.id,
    templateKey: input.templateKey,
    recipientSegment: "manual",
    status: result.status === "sent" ? "sent" : "failed",
    providerMessageId: result.id,
    reason: result.failureReason,
  });
}
