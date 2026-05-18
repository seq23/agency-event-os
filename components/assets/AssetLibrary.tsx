import { getAssetsForEvent } from "@/lib/mock/getMockData";
import { SectionCard } from "@/components/shared/SectionCard";
import { StatusBadge } from "@/components/shared/StatusBadge";

export function AssetLibrary({ eventId, clientFacing = false }: { eventId: string; clientFacing?: boolean }) {
  const assets = getAssetsForEvent(eventId).filter((asset) => !clientFacing || asset.visibility === "client_facing");

  return (
    <SectionCard title={clientFacing ? "Client-facing assets" : "Asset library"} eyebrow="Files and approvals">
      <div className="grid gap-3 md:grid-cols-2">
        {assets.map((asset) => (
          <div key={asset.id} className="rounded-2xl border border-slate-200 p-4">
            <p className="font-semibold">{asset.name}</p>
            <p className="mt-1 text-sm text-slate-500">{asset.assetType} · {asset.visibility}</p>
            <div className="mt-3"><StatusBadge status={asset.status} tone={asset.status === "approved" ? "good" : "warn"} /></div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
