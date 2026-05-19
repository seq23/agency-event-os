import { switchRoomFallbackAction } from "@/lib/actions/videoFallbackActions";
import type { V4RoomType, V4VideoProvider } from "@/types/v4";

export function FallbackConfirmationModal({ eventId, roomType, provider }: { eventId: string; roomType: V4RoomType; provider: V4VideoProvider }) {
  const requiresConfirmation = provider === "zoom" || provider === "google_meet";
  return (
    <form action={switchRoomFallbackAction} className="rounded-2xl border border-slate-200 bg-white p-3">
      <input type="hidden" name="eventId" value={eventId} />
      <input type="hidden" name="roomType" value={roomType} />
      <input type="hidden" name="provider" value={provider} />
      <input type="hidden" name="confirmedByCrew" value={requiresConfirmation ? "true" : "false"} />
      <p className="text-xs text-slate-500">{requiresConfirmation ? `${provider} requires explicit crew confirmation before changing attendee join targets.` : `${provider} is allowed as automatic fallback when healthy.`}</p>
      <button type="submit" className="mt-2 rounded-full bg-slate-950 px-4 py-2 text-xs font-black text-white">Switch to {provider}</button>
    </form>
  );
}
