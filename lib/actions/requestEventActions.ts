"use server";

import { redirect } from "next/navigation";
import { getEnv } from "@/lib/env";
import { appendRequestEventRecord } from "@/services/events/requestEventStore";
import { createAuditLog } from "@/services/audit/createAuditLog";
import { sendEmail } from "@/services/email/emailService";

function field(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

function notificationRecipient() {
  const env = getEnv();
  if (env.EMAIL_REPLY_TO) return env.EMAIL_REPLY_TO;
  const from = env.EMAIL_FROM || "";
  const match = from.match(/<([^>]+)>/);
  return match?.[1] || (from.includes("@") ? from : "");
}

export async function requestEventProduction(formData: FormData) {
  const name = field(formData, "name");
  const email = field(formData, "email");
  if (!name || !email || !email.includes("@")) redirect("/request-event?status=missing");

  const record = appendRequestEventRecord({
    id: `request-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    name,
    email,
    company: field(formData, "company"),
    eventType: field(formData, "eventType"),
    eventDate: field(formData, "eventDate"),
    audienceSize: field(formData, "audienceSize"),
    livestreamNeeds: field(formData, "livestreamNeeds"),
    networkingNeeds: field(formData, "networkingNeeds"),
    sponsorExpoNeeds: field(formData, "sponsorExpoNeeds"),
    speakerCount: field(formData, "speakerCount"),
    supportLevel: field(formData, "supportLevel"),
    notes: field(formData, "notes"),
    createdAt: new Date().toISOString(),
  });

  await createAuditLog({
    agencyId: "west-peek-productions",
    actorUserId: email,
    actorRole: "public_visitor",
    action: "request_event_production",
    resourceType: "request_event_intake",
    resourceId: record.id,
    visibility: "internal_agency",
  });

  const to = notificationRecipient();
  if (to) {
    try {
      await sendEmail({
        to,
        subject: `New West Peek Live event request: ${name}`,
        html: `<h1>New event request</h1><p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Company:</strong> ${record.company || ""}</p><p><strong>Event type:</strong> ${record.eventType || ""}</p><p><strong>Date:</strong> ${record.eventDate || ""}</p><p><strong>Audience:</strong> ${record.audienceSize || ""}</p><p><strong>Notes:</strong> ${record.notes || ""}</p>`,
        text: `New event request
Name: ${name}
Email: ${email}
Company: ${record.company || ""}
Event type: ${record.eventType || ""}
Date: ${record.eventDate || ""}
Audience: ${record.audienceSize || ""}
Notes: ${record.notes || ""}`,
      });
    } catch {
      await createAuditLog({
        agencyId: "west-peek-productions",
        actorUserId: "system",
        actorRole: "system",
        action: "request_event_notification_failed",
        resourceType: "request_event_intake",
        resourceId: record.id,
        visibility: "internal_agency",
      });
    }
  }

  redirect("/request-event?status=received");
}
