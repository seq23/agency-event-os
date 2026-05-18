import { SponsorPackageOverview } from "./SponsorPackageOverview";

export function SponsorSetupWizard({ eventId, sponsorId = "sponsor-clarity" }: { eventId: string; sponsorId?: string }) {
  const steps = ["Package", "Logo", "Booth copy", "CTA", "Resources", "Representatives", "Approval"];

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
          <p className="text-sm text-slate-500">Sponsor self-serve setup</p>
          <h1 className="mt-2 text-3xl font-semibold">Complete your sponsor deliverables</h1>
          <p className="mt-2 text-slate-600">Submit booth content, CTA, resources, representatives, and package deliverables for producer/client approval.</p>
        </div>

        <div className="grid gap-3 md:grid-cols-7">
          {steps.map((step, index) => (
            <div key={step} className={`rounded-2xl p-3 text-sm font-semibold ${index < 2 ? "bg-slate-950 text-white" : "bg-white text-slate-700 border border-slate-200"}`}>
              {index + 1}. {step}
            </div>
          ))}
        </div>

        <SponsorPackageOverview eventId={eventId} sponsorId={sponsorId} />
      </div>
    </main>
  );
}
