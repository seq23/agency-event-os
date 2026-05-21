"use server";

import { revalidatePath } from "next/cache";
import { getRuntimeStore } from "@/services/runtime/runtimeStoreFactory";
import { getCurrentAttendeeProfile } from "@/services/attendees/attendeeSessionService";

function clean(value: FormDataEntryValue | null) {
  return String(value || "").trim();
}

function cleanList(value: FormDataEntryValue | null) {
  return clean(value).split(/\n|,/).map((item) => item.trim()).filter(Boolean).slice(0, 20);
}

export async function updateAttendeeProfileAction(formData: FormData) {
  const eventId = clean(formData.get("eventId"));
  if (!eventId) throw new Error("Profile update requires event identity.");
  const profile = await getCurrentAttendeeProfile(eventId);
  if (!profile) throw new Error("Register before editing your attendee profile.");

  const updated = {
    ...profile,
    name: clean(formData.get("name")) || profile.name,
    company: clean(formData.get("company")) || profile.company,
    title: clean(formData.get("title")) || profile.title,
    personalWebsite: clean(formData.get("personalWebsite")) || undefined,
    socialLinks: cleanList(formData.get("socialLinks")),
    reasonForAttending: clean(formData.get("reasonForAttending")) || undefined,
    interestingFact: clean(formData.get("interestingFact")) || undefined,
    topicsOfInterest: cleanList(formData.get("topicsOfInterest")),
    networkingGoals: clean(formData.get("networkingGoals")) || undefined,
    networkingOptIn: formData.get("networkingOptIn") === "on",
    updatedAt: new Date().toISOString(),
  };

  await getRuntimeStore().upsertAttendeeProfile(updated);
  revalidatePath(`/venue/${eventId}/people`);
  revalidatePath(`/venue/${eventId}/networking`);
  revalidatePath(`/venue/${eventId}/stage`);
}
