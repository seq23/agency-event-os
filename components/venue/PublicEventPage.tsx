import { getEventBySlug, getClient, getSpeakersForEvent, getSponsorBoothsForEvent } from "@/lib/mock/getMockData";
import { SectionCard } from "@/components/shared/SectionCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatEventDate } from "@/lib/utils/format";

export function PublicEventPage({ slug }: { slug: string }) {
  const event = getEventBySlug(slug);
  const client = getClient(event.clientId);
  const speakers = getSpeakersForEvent(event.id);
  const booths = getSponsorBoothsForEvent(event.id);

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="rounded-3xl bg-slate-950 p-8 text-white">
          <p className="text-sm text-slate-300">{client.name}</p>
          <h1 className="mt-3 text-4xl font-semibold">{event.name}</h1>
          <p className="mt-3 max-w-3xl text-slate-300">{event.description}</p>
          <p className="mt-4 text-slate-300">{formatEventDate(event.startAt)} · {event.timezone}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={`/events/${event.slug}/register`} className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950">Register placeholder</a>
            <a href={`/venue/${event.id}/lobby`} className="rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold text-white">Preview venue</a>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <SectionCard title="Agenda preview">
            <div className="space-y-3">
              {["Welcome and Orientation", "Investor Panel", "Sponsor Spotlight", "Breakouts", "Networking"].map((item, index) => (
                <div key={item} className="rounded-xl bg-slate-50 p-3">
                  <p className="font-medium">{item}</p>
                  <p className="text-sm text-slate-500">Segment {index + 1}</p>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Speakers">
            <div className="space-y-3">
              {speakers.map((speaker) => (
                <div key={speaker.id} className="rounded-xl bg-slate-50 p-3">
                  <p className="font-medium">{speaker.name}</p>
                  <p className="text-sm text-slate-500">{speaker.title}, {speaker.company}</p>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        <SectionCard title="Sponsors">
          <div className="grid gap-3 md:grid-cols-2">
            {booths.map((booth) => (
              <div key={booth.id} className="rounded-xl bg-slate-50 p-4">
                <p className="font-semibold">{booth.name}</p>
                <p className="mt-1 text-sm text-slate-600">{booth.description}</p>
                <StatusBadge status={booth.status} />
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </main>
  );
}

export function EventRegistrationShell({ slug }: { slug: string }) {
  const event = getEventBySlug(slug);
  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-500">Registration shell</p>
        <h1 className="mt-2 text-3xl font-semibold">{event.name}</h1>
        <p className="mt-2 text-slate-600">Mock registration form. Payments and email confirmation are deferred.</p>
        <div className="mt-6 space-y-3">
          {["Name", "Email", "Company", "Title"].map((field) => (
            <div key={field}>
              <label className="text-sm font-medium text-slate-700">{field}</label>
              <div className="mt-1 h-11 rounded-xl border border-slate-200 bg-slate-50" />
            </div>
          ))}
          <button className="w-full rounded-xl bg-slate-950 px-4 py-3 font-semibold text-white">Submit registration placeholder</button>
        </div>
      </div>
    </main>
  );
}
