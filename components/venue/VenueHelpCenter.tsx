import type { VirtualVenueModel } from "@/types/virtualVenue";
import { HelpRequestForm } from "./HelpRequestForm";

export function VenueHelpCenter({ model }: { model: VirtualVenueModel }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
      <section className="rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold">Help center</h2>
        <p className="mt-2 text-slate-600">Get event support without leaving the venue.</p>
        <ul className="mt-4 space-y-2 text-sm text-slate-600">
          {model.helpTopics.map((topic) => <li key={topic}>• {topic}</li>)}
        </ul>
      </section>
      <HelpRequestForm eventId={model.eventId} topics={model.helpTopics} />
    </div>
  );
}
