import { getRuntimeStore } from "@/services/runtime/runtimeStoreFactory";

export async function recordEmailRuntimeEvent(input: { eventId: string; templateKey: string; recipientSegment: string; status: "queued" | "sent" | "blocked" | "failed"; providerMessageId?: string; reason?: string }) {
  return getRuntimeStore().appendEmailEvent({
    id: `email-${input.eventId}-${input.templateKey}-${Date.now()}`,
    eventId: input.eventId,
    templateKey: input.templateKey,
    recipientSegment: input.recipientSegment,
    status: input.status,
    providerMessageId: input.providerMessageId,
    reason: input.reason,
    createdAt: new Date().toISOString(),
  });
}
