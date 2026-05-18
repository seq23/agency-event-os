import { getEvent, getSessionsForEvent, getSponsorBoothsForEvent, getMockData } from "@/lib/mock/getMockData";
import { VenueShell } from "@/components/venue/VenueShell";
import { VideoPlaceholder } from "@/components/venue/VideoPlaceholder";
import { SectionCard } from "@/components/shared/SectionCard";
import { MetricCard } from "@/components/shared/MetricCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatEventDate } from "@/lib/utils/format";

export function EventLobby({ eventId }: { eventId: string }) {
  const event = getEvent(eventId);
  const sessions = getSessionsForEvent(eventId);
  const booths = getSponsorBoothsForEvent(eventId);

  return (
    <VenueShell eventId={eventId}>
      <div className="space-y-6">
        <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
          <p className="text-sm text-slate-500">Lobby</p>
          <h2 className="mt-2 text-3xl font-semibold">{event.name}</h2>
          <p className="mt-2 text-slate-600">{event.description}</p>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          <MetricCard label="Sessions" value={sessions.length} />
          <MetricCard label="Expo booths" value={booths.length} />
          <MetricCard label="Networking" value="Open" />
          <MetricCard label="Replay" value={event.replayEnabled ? "Enabled" : "Off"} />
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <SectionCard title="Live now">
            <a href={`/venue/${eventId}/stage`} className="block rounded-2xl bg-slate-950 p-5 text-white">
              <p className="text-sm text-slate-400">Main Stage</p>
              <p className="mt-1 text-xl font-semibold">Welcome and Orientation</p>
            </a>
          </SectionCard>
          <SectionCard title="Upcoming sessions">
            <div className="space-y-3">
              {sessions.map((session) => (
                <a key={session.id} href={`/venue/${eventId}/sessions/${session.id}`} className="block rounded-xl bg-slate-50 p-3">
                  <p className="font-medium">{session.name}</p>
                  <p className="text-sm text-slate-500">{formatEventDate(session.startAt)}</p>
                </a>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </VenueShell>
  );
}

export function MainStagePage({ eventId }: { eventId: string }) {
  return (
    <VenueShell eventId={eventId}>
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <VideoPlaceholder label="Main Stage" />
        <div className="space-y-6">
          <SectionCard title="Chat shell"><p className="text-sm text-slate-600">Mock chat panel. Persistence deferred.</p></SectionCard>
          <SectionCard title="Q&A shell"><p className="text-sm text-slate-600">Mock Q&A panel. Moderation deferred.</p></SectionCard>
          <SectionCard title="Poll shell"><p className="text-sm text-slate-600">Mock poll panel. Voting persistence deferred.</p></SectionCard>
        </div>
      </div>
    </VenueShell>
  );
}

export function SessionDirectory({ eventId }: { eventId: string }) {
  const sessions = getSessionsForEvent(eventId);
  return (
    <VenueShell eventId={eventId}>
      <SectionCard title="Sessions">
        <div className="grid gap-4 md:grid-cols-2">
          {sessions.map((session) => (
            <a key={session.id} href={`/venue/${eventId}/sessions/${session.id}`} className="rounded-2xl border border-slate-200 p-4 hover:bg-slate-50">
              <p className="font-semibold">{session.name}</p>
              <p className="mt-1 text-sm text-slate-500">{session.description}</p>
              <div className="mt-3"><StatusBadge status={session.status} /></div>
            </a>
          ))}
        </div>
      </SectionCard>
    </VenueShell>
  );
}

export function SessionRoomPage({ eventId, sessionId }: { eventId: string; sessionId: string }) {
  const session = getSessionsForEvent(eventId).find((item) => item.id === sessionId);
  return (
    <VenueShell eventId={eventId}>
      <div className="space-y-6">
        <VideoPlaceholder label={session?.name ?? "Session room"} />
        <SectionCard title="Session details">
          <p className="text-slate-600">{session?.description ?? "Session shell."}</p>
        </SectionCard>
      </div>
    </VenueShell>
  );
}

export function NetworkingPage({ eventId }: { eventId: string }) {
  return (
    <VenueShell eventId={eventId}>
      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Speed networking">
          <div className="rounded-2xl bg-slate-950 p-6 text-white">
            <p className="text-sm text-slate-400">Mock queue</p>
            <h2 className="mt-2 text-2xl font-semibold">Ready to match</h2>
            <p className="mt-2 text-slate-300">Connect, skip, and report actions are UI-only in this baseline.</p>
            <button className="mt-5 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-950">Join queue placeholder</button>
          </div>
        </SectionCard>
        <SectionCard title="Current match shell">
          <p className="text-sm text-slate-600">Timer, connection state, and video room hooks appear here later.</p>
        </SectionCard>
      </div>
    </VenueShell>
  );
}

export function ExpoDirectory({ eventId }: { eventId: string }) {
  const booths = getSponsorBoothsForEvent(eventId);
  return (
    <VenueShell eventId={eventId}>
      <SectionCard title="Expo">
        <div className="grid gap-4 md:grid-cols-2">
          {booths.map((booth) => (
            <a key={booth.id} href={`/venue/${eventId}/expo/${booth.id}`} className="rounded-2xl border border-slate-200 p-4 hover:bg-slate-50">
              <p className="font-semibold">{booth.name}</p>
              <p className="mt-1 text-sm text-slate-600">{booth.description}</p>
              <p className="mt-3 text-sm font-medium text-slate-950">{booth.ctaLabel}</p>
            </a>
          ))}
        </div>
      </SectionCard>
    </VenueShell>
  );
}

export function ExpoBoothPage({ eventId, boothId }: { eventId: string; boothId: string }) {
  const booth = getSponsorBoothsForEvent(eventId).find((item) => item.id === boothId);
  return (
    <VenueShell eventId={eventId}>
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <VideoPlaceholder label={`${booth?.name ?? "Sponsor"} booth`} />
          <SectionCard title={booth?.name ?? "Sponsor booth"}>
            <p className="text-slate-600">{booth?.description}</p>
            <button className="mt-5 rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white">{booth?.ctaLabel ?? "CTA placeholder"}</button>
          </SectionCard>
        </div>
        <SectionCard title="Resources">
          <div className="space-y-3">
            {["Founder Ops Checklist", "Demo Deck", "Book a Demo"].map((item) => (
              <div key={item} className="rounded-xl bg-slate-50 p-3 text-sm">{item}</div>
            ))}
          </div>
        </SectionCard>
      </div>
    </VenueShell>
  );
}

export function PeopleDirectory({ eventId }: { eventId: string }) {
  const attendees = getMockData().attendees.filter((attendee) => attendee.eventId === eventId);
  return (
    <VenueShell eventId={eventId}>
      <SectionCard title="People">
        <div className="grid gap-4 md:grid-cols-2">
          {attendees.map((attendee) => (
            <div key={attendee.id} className="rounded-2xl border border-slate-200 p-4">
              <p className="font-semibold">{attendee.name}</p>
              <p className="text-sm text-slate-500">{attendee.title}, {attendee.company}</p>
              <StatusBadge status={attendee.networkingEnabled ? "networking on" : "hidden"} />
            </div>
          ))}
        </div>
      </SectionCard>
    </VenueShell>
  );
}

export function ReplayLibrary({ eventId }: { eventId: string }) {
  return (
    <VenueShell eventId={eventId}>
      <SectionCard title="Replay library">
        <div className="grid gap-4 md:grid-cols-2">
          {["Welcome and Orientation", "Investor Panel", "Sponsor Spotlight"].map((item) => (
            <div key={item} className="rounded-2xl border border-slate-200 p-4">
              <p className="font-semibold">{item}</p>
              <p className="text-sm text-slate-500">Replay placeholder. Recording provider deferred.</p>
            </div>
          ))}
        </div>
      </SectionCard>
    </VenueShell>
  );
}

export function VenueHelpPage({ eventId }: { eventId: string }) {
  return (
    <VenueShell eventId={eventId}>
      <SectionCard title="Help">
        <div className="space-y-3 text-sm text-slate-600">
          <p>Refresh the page if video fails to load.</p>
          <p>Check your audio output before joining networking.</p>
          <p>Use the report button for attendee safety issues.</p>
        </div>
      </SectionCard>
    </VenueShell>
  );
}
