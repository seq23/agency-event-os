"use server";

import { redirect } from "next/navigation";
import { recordAnalyticsEvent } from "@/services/analytics/analyticsEventService";
import { sha256Hex } from "@/lib/security/portableCrypto";

function clean(value: FormDataEntryValue | null, fallback = "") {
  return String(value ?? fallback).trim();
}

export async function joinSpeedNetworkingQueueAction(formData: FormData) {
  const eventId = clean(formData.get("eventId"));
  const attendeeName = clean(formData.get("attendeeName"), "Local E2E Attendee");
  const attendeeEmail = clean(formData.get("attendeeEmail"), "local-e2e-attendee@westpeek.live");
  if (!eventId) throw new Error("Networking queue join requires event ID.");

  const subjectId = await sha256Hex(attendeeEmail.toLowerCase());
  await recordAnalyticsEvent({
    eventId,
    kind: "networking_joined",
    subjectId,
    metadata: {
      attendeeName,
      queueState: "waiting",
      source: "networking_queue_form",
    },
  }).catch(() => undefined);

  redirect(`/venue/${eventId}/networking?state=waiting&queued=1`);
}
