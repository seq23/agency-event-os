import { updateAttendeeLiveControl, setAttendeeLiveApproval } from "@/lib/actions/attendeeLiveActions";
import { getAttendeeLiveControlState } from "@/services/venue/attendeeLivePermissionService";

export async function AttendeeLiveControlPanel({ eventId = "event-summit" }: { eventId?: string }) {
  const main = await getAttendeeLiveControlState(eventId, "main_stage", "main-stage");
  const breakout = await getAttendeeLiveControlState(eventId, "breakout", "general-breakout");
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm" data-testid="attendee-live-control-panel">
      <p className="text-xs font-black uppercase tracking-[0.25em] text-brand-orange">Attendee live controls</p>
      <h2 className="mt-2 text-xl font-black text-slate-950">Crew-controlled camera and mic permissions</h2>
      <p className="mt-2 text-sm text-slate-600">Main stage attendee publishing is off/request-based by default. Breakout rooms can allow attendee camera/mic, but crew can revoke or emergency-disable all publishing.</p>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <form action={updateAttendeeLiveControl} className="rounded-2xl bg-slate-50 p-4">
          <input type="hidden" name="eventId" value={eventId} /><input type="hidden" name="roomKind" value="main_stage" /><input type="hidden" name="roomId" value="main-stage" />
          <p className="font-black">Main stage controls</p>
          <label className="mt-3 block text-sm"><input name="globalCameraEnabled" type="checkbox" defaultChecked={main.globalCameraEnabled} /> Allow attendee camera requests</label>
          <label className="mt-2 block text-sm"><input name="globalMicrophoneEnabled" type="checkbox" defaultChecked={main.globalMicrophoneEnabled} /> Allow attendee microphone requests</label>
          <label className="mt-2 block text-sm"><input name="requestRequired" type="checkbox" defaultChecked={main.requestRequired} /> Require crew approval for publishing</label>
          <label className="mt-2 block text-sm"><input name="attendeeJoinRequiresApproval" type="checkbox" defaultChecked={main.attendeeJoinRequiresApproval} /> Require crew permit before attendee can join/watch live stage</label>
          <label className="mt-2 block text-sm"><input name="emergencyPublishingDisabled" type="checkbox" defaultChecked={main.emergencyPublishingDisabled} /> Emergency disable all publishing</label>
          <button className="mt-4 rounded-full bg-slate-950 px-4 py-2 text-xs font-black text-white">Save main stage controls</button>
        </form>
        <form action={updateAttendeeLiveControl} className="rounded-2xl bg-slate-50 p-4">
          <input type="hidden" name="eventId" value={eventId} /><input type="hidden" name="roomKind" value="breakout" /><input type="hidden" name="roomId" value="general-breakout" />
          <p className="font-black">Breakout controls</p>
          <label className="mt-3 block text-sm"><input name="globalCameraEnabled" type="checkbox" defaultChecked={breakout.globalCameraEnabled} /> Allow breakout cameras</label>
          <label className="mt-2 block text-sm"><input name="globalMicrophoneEnabled" type="checkbox" defaultChecked={breakout.globalMicrophoneEnabled} /> Allow breakout microphones</label>
          <label className="mt-2 block text-sm"><input name="globalScreenShareEnabled" type="checkbox" defaultChecked={breakout.globalScreenShareEnabled} /> Allow screen share</label>
          <label className="mt-2 block text-sm"><input name="attendeeJoinRequiresApproval" type="checkbox" defaultChecked={breakout.attendeeJoinRequiresApproval} /> Require permit before entering breakout live room</label>
          <label className="mt-2 block text-sm"><input name="emergencyPublishingDisabled" type="checkbox" defaultChecked={breakout.emergencyPublishingDisabled} /> Lock breakout publishing</label>
          <button className="mt-4 rounded-full bg-slate-950 px-4 py-2 text-xs font-black text-white">Save breakout controls</button>
        </form>
      </div>
      <form action={setAttendeeLiveApproval} className="mt-4 rounded-2xl border border-slate-200 p-4">
        <p className="font-black">Attendee permit / revoke / re-permit path</p>
        <input type="hidden" name="eventId" value={eventId} /><input type="hidden" name="roomKind" value="main_stage" /><input type="hidden" name="roomId" value="main-stage" />
        <label className="mt-3 block text-sm font-bold">Attendee ID or email hash</label><input name="attendeeId" required className="mt-1 min-h-10 w-full rounded-full border border-slate-200 px-4 text-sm" placeholder="attendee-id-from-registration" />
        <label className="mt-3 inline-flex items-center gap-2 text-sm"><input name="canJoinLiveStream" type="checkbox" defaultChecked /> Permit live-stage entry/watch</label>
        <label className="ml-4 inline-flex items-center gap-2 text-sm"><input name="approvedForStage" type="checkbox" /> Approve to publish on main stage</label>
        <label className="ml-4 inline-flex items-center gap-2 text-sm"><input name="canPublishCamera" type="checkbox" /> Camera</label>
        <label className="ml-4 inline-flex items-center gap-2 text-sm"><input name="canPublishMicrophone" type="checkbox" /> Microphone</label>
        <label className="ml-4 inline-flex items-center gap-2 text-sm"><input name="revoked" type="checkbox" /> Revoke live access</label>
        <input name="revokedReason" className="ml-4 min-h-10 rounded-full border border-slate-200 px-4 text-sm" placeholder="optional revoke reason" />
        <button className="ml-4 rounded-full border border-slate-300 px-4 py-2 text-xs font-black">Apply live access decision</button>
      </form>
    </section>
  );
}
