import { WestPeekLiveWordmark } from "@/components/brand/WestPeekLiveWordmark";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-brand-ash px-5 py-10 text-brand-black sm:px-8 lg:px-12">
      <section className="mx-auto flex min-h-[80vh] max-w-6xl flex-col justify-center rounded-[2rem] border border-brand-line bg-white p-6 shadow-brand sm:p-10 lg:p-14">
        <p className="text-xs font-black uppercase tracking-[0.35em] text-brand-orange">West Peek Ventures</p>
        <h1 className="mt-5">
          <WestPeekLiveWordmark size="lg" />
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-brand-muted">
          A premium virtual event production platform for agencies running lobbies, stages, sessions, breakouts, sponsor booths, networking, replay, reporting, and client-ready operations.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a href="/app" className="rounded-full bg-brand-black px-5 py-3 text-center text-sm font-bold text-white hover:bg-brand-charcoal">
            Open production workspace
          </a>
          <a href="/venue/demo/lobby" className="rounded-full border border-brand-line px-5 py-3 text-center text-sm font-bold text-brand-black hover:border-brand-orange hover:text-brand-orange">
            Preview venue
          </a>
        </div>
      </section>
    </main>
  );
}
