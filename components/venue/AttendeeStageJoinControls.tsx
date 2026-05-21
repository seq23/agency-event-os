import { requestAttendeeStageAccess } from "@/lib/actions/attendeeLiveActions";
import type { AttendeeLiveControlState } from "@/types/attendeeLive";

export function AttendeeStageJoinControls({ eventId, roomId, control, attendeeId }: { eventId: string; roomId: string; control: AttendeeLiveControlState; attendeeId?: string }) {
  if (!attendeeId) return <div className="rounded-2xl bg-slate-100 p-4 text-sm font-bold text-slate-700" data-testid="stage-join-registration-required">Register to request camera or microphone access. Guest registration does not publish by default.</div>;
  if (control.emergencyPublishingDisabled) return <div className="rounded-2xl bg-amber-50 p-4 text-sm font-bold text-amber-900">Crew disabled attendee publishing during live operations.</div>;
  if (!control.globalCameraEnabled && !control.globalMicrophoneEnabled) return <div className="rounded-2xl bg-slate-100 p-4 text-sm font-bold text-slate-700">Camera/mic joining is currently disabled by crew.</div>;
  return (
    <form action={requestAttendeeStageAccess} className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4" data-testid="attendee-stage-request-form">
      <input type="hidden" name="eventId" value={eventId} /><input type="hidden" name="roomKind" value="main_stage" /><input type="hidden" name="roomId" value={roomId} /><input type="hidden" name="attendeeId" value={attendeeId} />
      <p className="text-sm font-black text-slate-950">Want to join the stage?</p><p className="mt-1 text-xs text-slate-600">Main stage camera access is crew-controlled and request-based by default.</p>
      <button className="mt-3 rounded-full bg-slate-950 px-4 py-2 text-xs font-black text-white">Request to Join Stage</button>
    </form>
  );
}
