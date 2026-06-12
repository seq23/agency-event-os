import type { V4RoomFallbackState } from "@/types/v4";

export function FallbackActiveBanner({ state }: { state: V4RoomFallbackState }) {
  if (!state.manualOverrideProvider && state.activeProvider === "livekit") return null;
  if (state.activeProvider === "google_meet") {
    return <section className="rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-900">The final backup room may be used for this session. Follow the production instructions on this page.</section>;
  }
  return <section className="rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-900">The production team is keeping this session live through the backup path. You can stay on this page.</section>;
}
