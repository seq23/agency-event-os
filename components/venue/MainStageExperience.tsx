import type { VirtualVenueModel } from "@/types/virtualVenue";
import { AnalyticsBeacon } from "@/components/analytics/AnalyticsBeacon";
import { FallbackActiveBanner } from "@/components/venue/FallbackActiveBanner";
import { SessionFullState } from "@/components/venue/SessionFullState";
import { SupportEscalationPanel } from "@/components/venue/SupportEscalationPanel";
import { getRoomFallbackState } from "@/services/video/roomFallbackService";

export async function MainStageExperience({ model }: { model: VirtualVenueModel }) {
  const fallbackState = await getRoomFallbackState(model.eventId, "main_stage");
  const liveSession = model.liveNow[0] || model.sessions[0];
  return (
    <div className="space-y-6">
      <AnalyticsBeacon eventId={model.eventId} kind="attendee_joined_session" subjectId={liveSession?.id || "main_stage"} />
      <FallbackActiveBanner state={fallbackState} />
      <section className="rounded-3xl bg-slate-950 p-6 text-white shadow-sm">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-slate-400">Main stage</p>
        <h1 className="mt-2 text-3xl font-black">{liveSession?.title || "Main stage is standing by"}</h1>
        <p className="mt-3 max-w-3xl text-slate-300">Active provider: {fallbackState.activeProvider}. If this provider degrades, production can switch the room-level fallback without disrupting the rest of the event.</p>
        <div className="mt-6 aspect-video rounded-3xl border border-white/10 bg-slate-900 p-6 text-slate-400">White-label video surface loads here when provider credentials are configured.</div>
      </section>
      {model.sessions.length > 50 ? <SessionFullState /> : null}
      <SupportEscalationPanel eventId={model.eventId} />
    </div>
  );
}
