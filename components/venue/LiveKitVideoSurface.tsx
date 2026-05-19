export function LiveKitVideoSurface({ label = "LiveKit video room" }: { label?: string }) {
  return (
    <div className="flex aspect-video items-center justify-center rounded-3xl bg-slate-950 text-white shadow-sm">
      <div className="text-center">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-300">LiveKit video surface</p>
        <p className="mt-2 text-2xl font-semibold">{label}</p>
        <p className="mt-2 text-sm text-slate-400">Provider: LiveKit primary. Automatic fallback uses Daily first, then Zoom, then Google Meet.</p>
      </div>
    </div>
  );
}
