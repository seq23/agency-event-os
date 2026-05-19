import type { VirtualVenueBooth } from "@/types/virtualVenue";
import { LiveKitVideoSurface } from "./LiveKitVideoSurface";
import { SponsorLeadCaptureForm } from "./SponsorLeadCaptureForm";

export function SponsorBoothExperience({ booth }: { booth: VirtualVenueBooth }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
      <section className="rounded-3xl bg-white p-5 shadow-sm">
        <LiveKitVideoSurface label={`${booth.name} booth`} />
        <h2 className="mt-5 text-2xl font-semibold">{booth.name}</h2>
        <p className="mt-2 text-slate-600">{booth.description}</p>
      </section>
      <SponsorLeadCaptureForm boothId={booth.id} />
    </div>
  );
}
