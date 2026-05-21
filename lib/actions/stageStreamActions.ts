"use server";
import { revalidatePath } from "next/cache";
import { provisionStreamYardLiveKitIngress } from "@/services/video/livekitIngressService";
import { applyStageStreamSignal } from "@/services/video/stageStreamStateService";
import type { StageStreamSignal } from "@/types/stageStream";

export async function generateStreamYardCredentials(formData: FormData) {
  const eventId = String(formData.get("eventId") || "event-summit");
  const stageId = String(formData.get("stageId") || "main-stage");
  await provisionStreamYardLiveKitIngress({ eventId, stageId, actorRole: "operator" });
  revalidatePath(`/admin/testing/${eventId}`);
}

export async function applyStageStreamOperatorSignal(formData: FormData) {
  const eventId = String(formData.get("eventId") || "event-summit");
  const stageId = String(formData.get("stageId") || "main-stage");
  const signal = String(formData.get("signal") || "manual_switch_to_daily") as StageStreamSignal;
  const reason = String(formData.get("reason") || "Operator selected action from testing console.");
  await applyStageStreamSignal({ eventId, stageId, signal, reason });
  revalidatePath(`/admin/testing/${eventId}`);
  revalidatePath(`/venue/${eventId}/stage`);
}
