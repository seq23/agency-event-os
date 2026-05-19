"use server";

import { createHash } from "crypto";
import { redirect } from "next/navigation";
import { getRuntimeStore } from "@/services/runtime/runtimeStoreFactory";
import { recordAnalyticsEvent } from "@/services/analytics/analyticsEventService";
import { getEventConfig } from "@/services/events/eventConfigRepository";

function hashEmail(value: string) {
  return createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

export async function submitEventRegistration(formData: FormData) {
  const eventId = String(formData.get("eventId") || "");
  const slug = String(formData.get("slug") || "");
  const email = String(formData.get("email") || "");
  const name = String(formData.get("name") || "");
  const company = String(formData.get("company") || "");
  if (!eventId || !slug) throw new Error("Registration requires event identity.");
  if (!email.includes("@")) throw new Error("Registration requires a valid email address.");
  const event = getEventConfig(eventId);
  if (!event) throw new Error(`Cannot register for unconfigured event ${eventId}.`);
  const createdAt = new Date().toISOString();
  const attendeeEmailHash = hashEmail(email);
  await getRuntimeStore().appendRegistration({
    id: `registration-${eventId}-${Date.now()}`,
    eventId,
    attendeeEmailHash,
    status: "submitted",
    createdAt,
  });
  await recordAnalyticsEvent({
    eventId,
    kind: "registration_submitted",
    subjectId: attendeeEmailHash,
    metadata: { nameProvided: Boolean(name), companyProvided: Boolean(company) },
  });
  redirect(`/venue/${eventId}/lobby?registered=1`);
}
