"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getRuntimeStore } from "@/services/runtime/runtimeStoreFactory";
import { recordAnalyticsEvent } from "@/services/analytics/analyticsEventService";
import { getCurrentAttendeeIdentity, getCurrentAttendeeProfile } from "@/services/attendees/attendeeSessionService";

export async function submitHelpRequestAction(formData: FormData) {
  const eventId = String(formData.get("eventId") || "");
  const subject = String(formData.get("subject") || "").trim();
  const topic = String(formData.get("topic") || "support").trim();
  if (!eventId || !subject) throw new Error("Help request requires event ID and subject.");
  const identity = await getCurrentAttendeeIdentity(eventId).catch(() => undefined);
  try {
    await getRuntimeStore().appendSupportRequest({
      id: `support-${eventId}-${identity?.attendeeId || "guest"}-${Date.now()}`,
      eventId,
      subject: `${topic}: ${subject}`,
      status: "open",
      createdAt: new Date().toISOString(),
      attendeeId: identity?.attendeeId,
    } as any);
    await recordAnalyticsEvent({ eventId, kind: "support_requested", subjectId: identity?.attendeeId, metadata: { topic, subjectLength: subject.length, attendeeId: identity?.attendeeId || "guest", attendeeDisplayName: identity?.displayName || "Guest" } }).catch(() => undefined);
  } catch {
    // Floating help must degrade safely instead of producing generic server errors.
  }
  revalidatePath(`/venue/${eventId}/help`);
}

export async function submitSponsorLeadAction(formData: FormData) {
  const eventId = String(formData.get("eventId") || "");
  const boothId = String(formData.get("boothId") || "");
  const interest = String(formData.get("interest") || "");
  if (!eventId || !boothId) throw new Error("Sponsor lead requires event ID and booth ID.");
  const profile = await getCurrentAttendeeProfile(eventId);
  if (!profile) redirect(`/events/${eventId}/register?reason=sponsor-opt-in`);

  const allowedFields = ["attendeeId", "name", "company", "title", "personalWebsite", "topicsOfInterest", "networkingGoals"];
  await getRuntimeStore().appendSponsorLeadOptIn({
    id: `sponsor-lead-${eventId}-${boothId}-${profile.attendeeId}-${Date.now()}`,
    eventId,
    attendeeId: profile.attendeeId,
    sponsorBoothId: boothId,
    allowedFields,
    createdAt: new Date().toISOString(),
  });
  await recordAnalyticsEvent({ eventId, kind: "sponsor_cta_clicked", subjectId: profile.attendeeId, metadata: { boothId, interestLength: interest.length, allowedFields: allowedFields.join(","), source: "intentional_sponsor_booth_opt_in" } }).catch(() => undefined);
  await recordAnalyticsEvent({ eventId, kind: "attendee_visited_sponsor_booth", subjectId: profile.attendeeId, metadata: { boothId } }).catch(() => undefined);
  revalidatePath(`/venue/${eventId}/expo/${boothId}`);
}
