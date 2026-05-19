import type { AssetRecord } from "@/types/assets";

export function AssetReviewPanel({ assets }: { assets: AssetRecord[] }) {
  return (
    <section className="rounded-3xl border border-brand-line bg-white p-4 shadow-sm sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Assets</p>
      <h2 className="mt-2 text-2xl font-semibold text-slate-950">Asset review</h2>
      <div className="mt-4 space-y-3">
        {assets.map((asset) => (
          <div key={asset.id} className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
            <div>
              <p className="font-semibold">{asset.fileName}</p>
              <p className="text-sm text-slate-600">{asset.assetType} · {asset.reviewStatus}</p>
            </div>
            <p className="text-xs uppercase tracking-wide text-slate-500">{asset.isLiveVersion ? "live" : "review"}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
