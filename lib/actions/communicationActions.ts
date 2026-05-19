"use server";

import { revalidatePath } from "next/cache";
import { requireCrewCapability } from "@/lib/auth/requireCrewCapability";
import { sendEventCommunication } from "@/services/communications/eventCommunicationService";

export async function sendEventCommunicationAction(formData: FormData) {
  const eventId = String(formData.get("eventId") || "");
  const templateKey = String(formData.get("templateKey") || "");
  const to = String(formData.get("to") || "");
  const recipientName = String(formData.get("recipientName") || "");
  await requireCrewCapability("edit_draft_setup", eventId);
  await sendEventCommunication({ eventId, templateKey, to, recipientName });
  revalidatePath(`/app/events/${eventId}/communications`);
}
