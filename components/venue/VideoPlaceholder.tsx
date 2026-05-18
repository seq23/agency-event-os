export function VideoPlaceholder({ label = "Mock video room" }: { label?: string }) {
  return (
    <div className="flex aspect-video items-center justify-center rounded-3xl bg-slate-950 text-white shadow-sm">
      <div className="text-center">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-400">Video placeholder</p>
        <p className="mt-2 text-2xl font-semibold">{label}</p>
        <p className="mt-2 text-sm text-slate-400">Future provider: LiveKit / Daily / Agora / Mux / Twilio.</p>
      </div>
    </div>
  );
}
