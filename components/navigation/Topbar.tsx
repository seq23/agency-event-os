import { WestPeekLiveWordmark } from "@/components/brand/WestPeekLiveWordmark";

export function Topbar() {
  return (
    <header className="sticky top-0 z-10 border-b border-brand-line bg-white/90 px-4 py-3 backdrop-blur sm:px-6 lg:px-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="lg:hidden"><WestPeekLiveWordmark size="sm" /></div>
          <p className="hidden text-xs font-black uppercase tracking-[0.28em] text-brand-orange lg:block">Production workspace</p>
          <p className="mt-1 text-sm text-brand-muted">Plan, produce, run, and report on premium client events.</p>
        </div>
        <div className="inline-flex w-fit rounded-full border border-brand-line bg-brand-ash px-3 py-2 text-sm font-semibold text-brand-black">
          S.L. Taylor
        </div>
      </div>
    </header>
  );
}
