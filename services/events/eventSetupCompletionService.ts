import { getAttendeeConfig, getEventAccessConfig, getEventConfig, getEventConfigPackage, getEventIndex } from "@/services/events/eventConfigRepository";

export type SetupSectionKey = "basics" | "branding" | "attendee-flow" | "venue" | "agenda" | "speakers" | "sponsors" | "access" | "run-of-show" | "video" | "communications" | "preview" | "publish";

export interface SetupSectionStatus {
  key: SetupSectionKey;
  label: string;
  href: string;
  complete: boolean;
  blockers: string[];
  description: string;
}

const setupSections: Array<{ key: SetupSectionKey; label: string; description: string }> = [
  { key: "basics", label: "Basics", description: "Event identity, client, timezone, status, and public code." },
  { key: "branding", label: "Branding", description: "Logo, hero, theme, and public event visual identity." },
  { key: "attendee-flow", label: "Attendee Flow", description: "Join states, registration, replay, help, and not-open handling." },
  { key: "venue", label: "Venue Modules", description: "Lobby, stage, sessions, expo, networking, replay, and support." },
  { key: "agenda", label: "Agenda", description: "Public schedule plus room/session mapping." },
  { key: "speakers", label: "Speakers", description: "Speaker profiles, assignments, onboarding, and tech check readiness." },
  { key: "sponsors", label: "Sponsors", description: "Booth setup, CTA, assets, lead capture, and reporting readiness." },
  { key: "access", label: "Access", description: "Public code, crew password env key, and role-scoped guest env keys." },
  { key: "run-of-show", label: "Run of Show", description: "Segments, cues, producer notes, technical cues, and backup plan." },
  { key: "video", label: "Video", description: "LiveKit, Daily, Zoom, Google Meet ladder, room overrides, and rollback." },
  { key: "communications", label: "Communications", description: "Attendee, speaker, sponsor, client, crew, replay, and report email templates." },
  { key: "preview", label: "Preview", description: "Public, client, speaker, sponsor, and crew-lite journeys before publish." },
  { key: "publish", label: "Publish", description: "Review, config package generation, Actions PR, deploy, and smoke boundary." },
];

function hasValue(value: unknown) {
  if (Array.isArray(value)) return value.length > 0;
  return Boolean(value);
}

export function getSetupSections(eventId: string): SetupSectionStatus[] {
  const event = getEventConfig(eventId);
  const packageConfig = getEventConfigPackage(eventId);
  const access = event ? getEventAccessConfig(event.slug) : undefined;
  const attendee = getAttendeeConfig(eventId);
  const blockersByKey: Record<SetupSectionKey, string[]> = {
    basics: [],
    branding: [],
    "attendee-flow": [],
    venue: [],
    agenda: [],
    speakers: [],
    sponsors: [],
    access: [],
    "run-of-show": [],
    video: [],
    communications: [],
    preview: [],
    publish: [],
  };

  if (!event) blockersByKey.basics.push("Event config missing from data/events.");
  if (event && !event.publicCode) blockersByKey.basics.push("Public code missing.");
  if (!packageConfig.branding?.logo || !packageConfig.branding?.hero) blockersByKey.branding.push("Logo and hero assets must be configured.");
  if (!attendee?.joinStates?.includes("invalid_code")) blockersByKey["attendee-flow"].push("Invalid-code UX state is not declared.");
  if (!attendee?.joinStates?.includes("live")) blockersByKey["attendee-flow"].push("Live event UX state is not declared.");
  if (!packageConfig.attendee?.defaultDestination) blockersByKey.venue.push("Default venue destination missing.");
  if (!hasValue(packageConfig.agenda?.sessions)) blockersByKey.agenda.push("At least one agenda session is required.");
  if (!hasValue(packageConfig.speakers?.speakers)) blockersByKey.speakers.push("At least one speaker record is required.");
  if (!hasValue(packageConfig.sponsors?.sponsors)) blockersByKey.sponsors.push("At least one sponsor record is required for the demo config.");
  if (!access?.crewPasswordEnvKey) blockersByKey.access.push("Crew password env key missing.");
  if (!access?.specialGuestCodes?.length) blockersByKey.access.push("Special guest env-key mapping missing.");
  if (!hasValue(packageConfig.runOfShow?.segments)) blockersByKey["run-of-show"].push("At least one run-of-show segment is required.");
  if (!packageConfig.video?.providerLadder?.includes("livekit")) blockersByKey.video.push("LiveKit must remain the first provider in the ladder.");
  if (!packageConfig.video?.zoomRequiresCrewConfirmation) blockersByKey.video.push("Zoom fallback must require crew confirmation.");
  if (!hasValue(packageConfig.communications?.templates)) blockersByKey.communications.push("Communications templates are missing.");
  if (getEventIndex().length === 0) blockersByKey.preview.push("No event index records are available for preview resolution.");
  if (event?.publishLifecycle !== "published" && event?.publishLifecycle !== "approved") blockersByKey.publish.push("Event must be approved or published before final public release.");

  return setupSections.map((section) => ({
    ...section,
    href: section.key === "basics" ? `/app/events/${eventId}/setup` : `/app/events/${eventId}/${section.key}`,
    blockers: blockersByKey[section.key],
    complete: blockersByKey[section.key].length === 0,
  }));
}

export function getSetupCompletion(eventId: string) {
  const sections = getSetupSections(eventId);
  const completeCount = sections.filter((section) => section.complete).length;
  return {
    eventId,
    sections,
    completeCount,
    totalCount: sections.length,
    score: Math.round((completeCount / sections.length) * 100),
    readyForReview: sections.every((section) => section.complete || section.key === "publish"),
    blockers: sections.flatMap((section) => section.blockers.map((blocker) => `${section.label}: ${blocker}`)),
  };
}
