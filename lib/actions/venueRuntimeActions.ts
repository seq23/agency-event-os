"use server";

import { createHash } from "crypto";
import { revalidatePath } from "next/cache";
import { getRuntimeStore } from "@/services/runtime/runtimeStoreFactory";
import { recordAnalyticsEvent } from "@/services/analytics/analyticsEventService";

function hashOptional(value: string) {
  return createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

export async function submitHelpRequestAction(formData: FormData) {
  const eventId = String(formData.get("eventId") || "");
  const subject = String(formData.get("subject") || "").trim();
  const topic = String(formData.get("topic") || "support").trim();
  if (!eventId || !subject) throw new Error("Help request requires event ID and subject.");
  await getRuntimeStore().appendSupportRequest({
    id: `support-${eventId}-${Date.now()}`,
    eventId,
    subject: `${topic}: ${subject}`,
    status: "open",
    createdAt: new Date().toISOString(),
  });
  await recordAnalyticsEvent({ eventId, kind: "support_requested", metadata: { topic, subjectLength: subject.length } });
  revalidatePath(`/venue/${eventId}/help`);
}

export async function submitSponsorLeadAction(formData: FormData) {
  const eventId = String(formData.get("eventId") || "");
  const boothId = String(formData.get("boothId") || "");
  const email = String(formData.get("email") || "");
  const interest = String(formData.get("interest") || "");
  if (!eventId || !boothId || !email.includes("@")) throw new Error("Sponsor lead requires event ID, booth ID, and valid email.");
  const subjectId = hashOptional(email);
  await recordAnalyticsEvent({
    eventId,
    kind: "sponsor_cta_clicked",
    subjectId,
    metadata: { boothId, interestLength: interest.length },
  });
  await recordAnalyticsEvent({
    eventId,
    kind: "attendee_visited_sponsor_booth",
    subjectId,
    metadata: { boothId },
  });
  revalidatePath(`/venue/${eventId}/expo/${boothId}`);
}
