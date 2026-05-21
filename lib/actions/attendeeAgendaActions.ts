"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentAttendeeProfile } from "@/services/attendees/attendeeSessionService";
import { upsertAttendeeAgendaIntent } from "@/services/attendees/attendeeAgendaIntentService";

function values(formData: FormData, key: string) {
  return formData.getAll(key).map((value) => String(value).trim()).filter(Boolean);
}

export async function updateMyAgendaAction(formData: FormData) {
  const eventId = String(formData.get("eventId") || "").trim();
  if (!eventId) throw new Error("Agenda update requires event identity.");
  const profile = await getCurrentAttendeeProfile(eventId);
  if (!profile) redirect(`/events/${eventId}/register?reason=agenda`);

  await upsertAttendeeAgendaIntent({
    eventId,
    attendeeId: profile.attendeeId,
    plannedSessionIds: values(formData, "plannedSessionIds"),
    plannedBreakoutIds: values(formData, "plannedBreakoutIds"),
    plannedSponsorBoothIds: values(formData, "plannedSponsorBoothIds"),
    wantsSessionReminders: formData.get("wantsSessionReminders") === "on",
  });

  revalidatePath(`/venue/${eventId}/stage`);
  revalidatePath(`/venue/${eventId}/lobby`);
  redirect(`/venue/${eventId}/stage?agenda=updated`);
}
