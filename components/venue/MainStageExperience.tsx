import type { VirtualVenueModel } from "@/types/virtualVenue";
import { AnalyticsBeacon } from "@/components/analytics/AnalyticsBeacon";
import { FallbackActiveBanner } from "@/components/venue/FallbackActiveBanner";
import { FloatingHelpButton } from "@/components/venue/FloatingHelpButton";
import { MainStageAgendaStrip } from "@/components/venue/MainStageAgendaStrip";
import { MainStageLiveChat } from "@/components/venue/MainStageLiveChat";
import { SessionFullState } from "@/components/venue/SessionFullState";
import { StagePlayer } from "@/components/video/StagePlayer";
import { AttendeeStageJoinControls } from "@/components/venue/AttendeeStageJoinControls";
import { getPublicStageStreamState } from "@/services/video/stageStreamStateService";
import { getAttendeeLiveControlState } from "@/services/venue/attendeeLivePermissionService";
import { createInitialRoomFallbackState, getRoomFallbackState } from "@/services/video/roomFallbackService";
import { getCurrentAttendeeIdentity } from "@/services/attendees/attendeeSessionService";
import { MyAgendaPanel } from "@/components/venue/MyAgendaPanel";
import { EditAttendeeProfilePanel } from "@/components/venue/EditAttendeeProfilePanel";

export async function MainStageExperience({ model }: { model: VirtualVenueModel }) {
  const fallbackState = await getRoomFallbackState(model.eventId, "main_stage").catch(() => createInitialRoomFallbackState(model.eventId, "main_stage"));
  const stageStreamState = await getPublicStageStreamState(model.eventId, "main-stage");
  const attendeeLiveControl = await getAttendeeLiveControlState(model.eventId, "main_stage", "main-stage");
  const identity = await getCurrentAttendeeIdentity(model.eventId).catch(() => undefined);
  const liveSession = model.liveNow[0] || model.sessions[0];
  return (
    <div className="space-y-6">
      <AnalyticsBeacon eventId={model.eventId} kind="attendee_joined_session" subjectId={liveSession?.id || "main_stage"} />
      <FallbackActiveBanner state={fallbackState} />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <section className="rounded-3xl bg-slate-950 p-6 text-white shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-slate-400">Main stage</p>
          <h1 className="mt-2 text-3xl font-black">{liveSession?.title || "Main stage is standing by"}</h1>
          <p className="mt-3 max-w-3xl text-slate-300">Active provider: {fallbackState.activeProvider}. If this provider degrades, production can switch the room-level fallback without disrupting the rest of the event.</p>
          <div className="mt-6">
            <StagePlayer initialState={stageStreamState} eventId={model.eventId} stageId="main-stage" viewerRole="attendee" displayName={identity?.displayName || "Registered attendee"} profileId={identity?.attendeeId} />
          </div>
          <div className="mt-5">
            <AttendeeStageJoinControls eventId={model.eventId} roomId="main-stage" control={attendeeLiveControl} attendeeId={identity?.attendeeId} />
          </div>
        </section>
        <MainStageLiveChat model={model} />
      </div>
      <MyAgendaPanel model={model} />
      <EditAttendeeProfilePanel eventId={model.eventId} />
      <MainStageAgendaStrip sessions={model.sessions} eventId={model.eventId} />
      {model.sessions.length > 50 ? <SessionFullState /> : null}
      <FloatingHelpButton eventId={model.eventId} />
    </div>
  );
}
