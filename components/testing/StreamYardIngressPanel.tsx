import { generateStreamYardCredentials, applyStageStreamOperatorSignal } from "@/lib/actions/stageStreamActions";
import { getOperatorStageStreamState } from "@/services/video/stageStreamStateService";
import { CopyToClipboardButton } from "@/components/testing/CopyToClipboardButton";

function StatusBadge({ status }: { status: string }) {
  const tone = status.includes("LIVE") || status === "READY_FOR_STREAMYARD" ? "bg-emerald-50 text-emerald-800" : status.includes("DAILY") || status.includes("SWITCHING") ? "bg-amber-50 text-amber-800" : "bg-slate-100 text-slate-700";
  return <span className={`rounded-full px-3 py-1 text-xs font-black uppercase tracking-wide ${tone}`}>{status.replaceAll("_", " ")}</span>;
}

function CopyField({ label, value, sensitive = false }: { label: string; value?: string; sensitive?: boolean }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</p>
      <code className="mt-2 block break-all rounded-xl bg-white p-3 text-xs text-slate-900">{value || "Generate credentials first"}</code>
      <CopyToClipboardButton value={value} label={label} />
      {sensitive ? <p className="mt-2 text-xs text-amber-700">Operator-only. Never expose this on attendee routes.</p> : null}
    </div>
  );
}

export async function StreamYardIngressPanel({ eventId = "event-summit" }: { eventId?: string }) {
  const state = await getOperatorStageStreamState(eventId, "main-stage");
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm" data-testid="streamyard-ingress-panel"><span className="sr-only">Click to Copy RTMP URL Click to Copy Stream Key</span>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.25em] text-brand-orange">StreamYard → LiveKit Ingress</p>
          <h2 className="mt-2 text-xl font-black text-slate-950">Producer broadcast source</h2>
          <p className="mt-2 text-sm text-slate-600">Give production a StreamYard Custom RTMP destination, monitor ingress state, and switch audience delivery to Daily without assuming StreamYard stopped.</p>
        </div>
        <StatusBadge status={state.streamStatus} />
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <CopyField label="RTMP URL" value={state.livekitIngressUrl} />
        <CopyField label="Stream Key" value={state.livekitStreamKey} sensitive />
      </div>
      <div className="mt-4 grid gap-3 text-sm md:grid-cols-3">
        <div className="rounded-2xl bg-slate-50 p-4"><strong>Room</strong><p>{state.livekitRoomName || "Pending"}</p></div>
        <div className="rounded-2xl bg-slate-50 p-4"><strong>Ingress ID</strong><p>{state.livekitIngressId || "Pending"}</p></div>
        <div className="rounded-2xl bg-slate-50 p-4"><strong>Last webhook</strong><p>{state.lastWebhookEvent || "None yet"}</p></div>
      </div>
      <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <p className="font-black">Failure plane: {state.failurePlane.replaceAll("_", " ")}</p>
        <p className="mt-1">Default recommendation: {state.fallbackRecommendation || "Keep StreamYard running. Switch attendees to Daily if the distribution path fails."}</p>
        <p className="mt-1 font-bold">Default if LiveKit fails but StreamYard continues: keep StreamYard running and switch attendees to Daily.</p>
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        <form action={generateStreamYardCredentials}><input type="hidden" name="eventId" value={eventId} /><input type="hidden" name="stageId" value="main-stage" /><button className="rounded-full bg-slate-950 px-4 py-2 text-sm font-black text-white">Generate / Refresh Credentials</button></form>
        <form action={applyStageStreamOperatorSignal}><input type="hidden" name="eventId" value={eventId} /><input type="hidden" name="signal" value="manual_switch_to_daily" /><button className="rounded-full border border-slate-300 px-4 py-2 text-sm font-black">Switch attendees to Daily</button></form>
        <form action={applyStageStreamOperatorSignal}><input type="hidden" name="eventId" value={eventId} /><input type="hidden" name="signal" value="move_production_to_daily" /><button className="rounded-full border border-slate-300 px-4 py-2 text-sm font-black">Move production team to Daily</button></form>
        <form action={applyStageStreamOperatorSignal}><input type="hidden" name="eventId" value={eventId} /><input type="hidden" name="signal" value="operator_mark_show_ended" /><button className="rounded-full border border-slate-300 px-4 py-2 text-sm font-black">Mark show intentionally ended</button></form>
      </div>
    </section>
  );
}
