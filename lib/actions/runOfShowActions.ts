"use server";

import { revalidatePath } from "next/cache";
import { getRuntimeStore } from "@/services/runtime/runtimeStoreFactory";
import type { V6RunOfShowRuntimeEvent } from "@/services/runtime/runtimeStore";

const actionMap: Record<string, V6RunOfShowRuntimeEvent["action"]> = {
  "Mark ready": "mark_ready",
  "Mark live": "mark_live",
  "Mark complete": "mark_complete",
  Delay: "delay",
  Skip: "skip",
  Extend: "note",
  "Emergency note": "note",
  "Trigger incident": "note",
  "Notify team": "note",
};

function clean(value: FormDataEntryValue | null, fallback = "") {
  return String(value ?? fallback).trim();
}

export async function recordRunOfShowControlAction(formData: FormData) {
  const eventId = clean(formData.get("eventId"));
  const segmentId = clean(formData.get("segmentId"), "current-segment");
  const actorRole = clean(formData.get("actorRole"), "producer");
  const label = clean(formData.get("label"), "Emergency note");
  if (!eventId) throw new Error("Run-of-show action requires event ID.");

  await getRuntimeStore().appendRunOfShowEvent({
    id: `ros-${eventId}-${segmentId}-${Date.now()}`,
    eventId,
    segmentId,
    action: actionMap[label] ?? "note",
    actorRole,
    createdAt: new Date().toISOString(),
  }).catch(() => undefined);

  revalidatePath(`/app/events/${eventId}/run-of-show`);
  revalidatePath(`/crew/events/${eventId}/run-of-show`);
  revalidatePath(`/venue/${eventId}/run-of-show`);
}
