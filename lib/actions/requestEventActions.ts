"use server";

import { redirect } from "next/navigation";
import { getEnv } from "@/lib/env";
import { appendRequestEventRecord } from "@/services/events/requestEventStore";
import { createAuditLog } from "@/services/audit/createAuditLog";
import { sendEmail } from "@/services/email/emailService";

/**
 * Public event-request intake.
 *
 * This action used to end in an unconditional
 * `redirect("/request-event?status=received")`. Nothing on the path to it could
 * make it not run: the store returned the same record whether or not it had
 * persisted anything, `sendEmail` failures were swallowed into an audit log,
 * and `createAuditLog` swallows its own errors by design. So there were three
 * independent ways for a request to vanish, all of which still told the visitor
 * their request had been received.
 *
 * The rule now: the success page is reachable only if at least one durable
 * destination confirmed the request. Storage confirming is enough. Email
 * confirming is enough. Neither confirming is a failure, and it is shown as
 * one, with an address the visitor can use instead.
 */

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

const errorMessage = (error: unknown) => (error instanceof Error ? error.message : String(error));

export async function requestEventProduction(formData: FormData) {
  const name = field(formData, "name");
  const email = field(formData, "email");
  if (!name || !email || !email.includes("@")) redirect("/request-event?status=missing");

  const persisted = await appendRequestEventRecord({
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

  const record = persisted.record;

  await createAuditLog({
    agencyId: "west-peek-productions",
    actorUserId: email,
    actorRole: "public_visitor",
    action: "request_event_production",
    resourceType: "request_event_intake",
    resourceId: record.id,
    visibility: "internal_agency",
  });

  if (!persisted.ok) {
    // Storage failed. Record why, so a dropped request leaves a trace even when
    // the email path also fails. createAuditLog swallows its own errors, so
    // this is a best-effort breadcrumb rather than a guarantee — which is
    // exactly why it is not what the success decision is based on.
    await createAuditLog({
      agencyId: "west-peek-productions",
      actorUserId: "system",
      actorRole: "system",
      action: "request_event_persist_failed",
      resourceType: "request_event_intake",
      resourceId: record.id,
      visibility: "internal_agency",
      newValue: { reason: persisted.reason },
    });
    // createAuditLog does not forward newValue into the stored log, and it
    // swallows its own failures, so this is the line that actually reaches an
    // operator via `wrangler tail`.
    console.error(`request-event: intake not stored (${persisted.reason}) for ${record.id}`);
  }

  // A "sent" result from the real provider is the only email outcome that
  // counts. MockEmailProvider returns provider "mock" and discards the message,
  // which is what happens whenever RESEND_API_KEY or EMAIL_FROM is unset on the
  // Worker, and an unconfigured mailer must never look like a delivered one.
  let emailDelivered = false;
  const to = notificationRecipient();

  if (to) {
    try {
      const result = await sendEmail({
        to,
        subject: `New West Peek Live event request: ${name}`,
        replyTo: email,
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

      emailDelivered = result.provider === "resend" && result.status === "sent";
    } catch (error) {
      await createAuditLog({
        agencyId: "west-peek-productions",
        actorUserId: "system",
        actorRole: "system",
        action: "request_event_notification_failed",
        resourceType: "request_event_intake",
        resourceId: record.id,
        visibility: "internal_agency",
        newValue: { reason: errorMessage(error) },
      });
      console.error(`request-event: notification failed for ${record.id}: ${errorMessage(error)}`);
    }
  }

  // Storage confirmed, or the notification was genuinely delivered. Either is a
  // real destination. Neither is not.
  if (persisted.ok || emailDelivered) redirect("/request-event?status=received");

  redirect("/request-event?status=failed");
}
