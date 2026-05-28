import { SpeakerPortalDashboard } from "@/components/speakers/SpeakerManager";

export default function SpeakerTechCheck() {
  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <section className="mb-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-black uppercase tracking-[0.35em] text-slate-500">Speaker tech check</p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">Camera, microphone, lighting, and connection check.</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
          Use this surface before showtime to confirm camera framing, microphone input, browser permissions, connection quality, backstage readiness, and teleprompter access.
        </p>
      </section>
      <SpeakerPortalDashboard />
    </main>
  );
}
