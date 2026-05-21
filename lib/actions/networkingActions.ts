"use server";

import { redirect } from "next/navigation";
import { recordAnalyticsEvent } from "@/services/analytics/analyticsEventService";
import { getCurrentAttendeeIdentity } from "@/services/attendees/attendeeSessionService";

function clean(value: FormDataEntryValue | null) {
  return String(value ?? "").trim();
}

export async function joinSpeedNetworkingQueueAction(formData: FormData) {
  const eventId = clean(formData.get("eventId"));
  if (!eventId) throw new Error("Networking queue join requires event ID.");
  const identity = await getCurrentAttendeeIdentity(eventId);
  if (!identity) redirect(`/events/${eventId}/register?reason=networking`);

  await recordAnalyticsEvent({
    eventId,
    kind: "networking_joined",
    subjectId: identity.attendeeId,
    metadata: {
      attendeeId: identity.attendeeId,
      attendeeName: identity.displayName,
      attendeeCompany: identity.company,
      queueState: "waiting",
      source: "networking_queue_form",
    },
  }).catch(() => undefined);

  redirect(`/venue/${eventId}/networking?state=waiting&queued=1`);
}
