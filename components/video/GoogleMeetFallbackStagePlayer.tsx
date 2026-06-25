"use client";

export function GoogleMeetFallbackStagePlayer({ fallbackUrl }: { fallbackUrl?: string }) {
  return (
    <div className="flex aspect-video items-center justify-center rounded-3xl bg-slate-900 p-8 text-center text-white">
      <div className="max-w-lg">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-brand-orange">Backup room</p>
        <h2 className="mt-3 text-2xl font-black">Open the final backup room</h2>
        <p className="mt-3 text-sm text-slate-300">The production team has moved this session to the final continuity room.</p>
        {fallbackUrl ? <a href={fallbackUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex rounded-full bg-white px-5 py-3 text-sm font-black text-slate-950">Open backup room</a> : <p className="mt-5 rounded-2xl border border-white/15 p-4 text-sm">The backup room link is being prepared. Stay here for the next instruction.</p>}
      </div>
    </div>
  );
}
