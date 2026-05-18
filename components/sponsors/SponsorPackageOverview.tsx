import { getSponsorPackage } from "@/services/sponsor-ops";
import { SectionCard } from "@/components/shared/SectionCard";
import { StatusBadge } from "@/components/shared/StatusBadge";

export function SponsorPackageOverview({ eventId, sponsorId = "sponsor-clarity" }: { eventId: string; sponsorId?: string }) {
  const sponsorPackage = getSponsorPackage(eventId, sponsorId);

  return (
    <SectionCard title={sponsorPackage.tierName} eyebrow="Sponsor package">
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl bg-slate-50 p-4"><p className="text-sm text-slate-500">Status</p><p className="font-semibold">{sponsorPackage.status.replace(/_/g, " ")}</p></div>
        <div className="rounded-2xl bg-slate-50 p-4"><p className="text-sm text-slate-500">ROS mentions</p><p className="font-semibold">{sponsorPackage.rosMentionsAllowed}</p></div>
        <div className="rounded-2xl bg-slate-50 p-4"><p className="text-sm text-slate-500">Lead access</p><p className="font-semibold">{sponsorPackage.leadAccessLevel.replace(/_/g, " ")}</p></div>
        <div className="rounded-2xl bg-slate-50 p-4"><p className="text-sm text-slate-500">Reporting</p><p className="font-semibold">{sponsorPackage.reportingLevel}</p></div>
      </div>

      <div className="mt-5 space-y-3">
        {sponsorPackage.deliverables.map((item) => (
          <div key={item.id} className="flex items-center justify-between rounded-2xl border border-slate-200 p-4">
            <div>
              <p className="font-semibold">{item.label}</p>
              <p className="text-sm text-slate-500">Due {new Date(item.dueAt).toLocaleDateString()} · Client approval {item.clientApprovalRequired ? "required" : "not required"}</p>
            </div>
            <StatusBadge status={item.status} tone={["approved", "locked"].includes(item.status) ? "good" : "warn"} />
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
