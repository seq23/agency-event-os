import type { SpeakerScriptVersion } from "@/types/speakerOps";
import { StatusBadge } from "@/components/shared/StatusBadge";

export function TeleprompterVersionPanel({
  approved,
  pending,
}: {
  approved?: SpeakerScriptVersion;
  pending?: SpeakerScriptVersion;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">Teleprompter versions</p>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl bg-emerald-50 p-4">
          <p className="text-sm font-semibold text-emerald-800">Live approved version</p>
          <p className="mt-1 text-lg font-semibold text-slate-950">{approved?.title ?? "No live script"}</p>
          <p className="mt-1 text-sm text-slate-600">{approved ? `v${approved.versionNumber}` : "Producer approval required."}</p>
        </div>
        <div className="rounded-2xl bg-amber-50 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-amber-800">Pending change</p>
              <p className="mt-1 text-lg font-semibold text-slate-950">{pending?.title ?? "No pending script"}</p>
            </div>
            {pending ? <StatusBadge status={pending.status} tone="warn" /> : null}
          </div>
          <p className="mt-1 text-sm text-slate-600">
            {pending ? `v${pending.versionNumber} is not live until producer approval.` : "Speaker is using the locked version."}
          </p>
        </div>
      </div>
    </div>
  );
}
