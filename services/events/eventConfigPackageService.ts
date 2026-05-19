import { getEventConfig, getEventConfigPackage } from "@/services/events/eventConfigRepository";

export function buildEventConfigPackageManifest(eventId: string) {
  const event = getEventConfig(eventId);
  if (!event) throw new Error(`Cannot build config package manifest because event ${eventId} is not configured.`);
  const packageConfig = getEventConfigPackage(eventId);
  return {
    slug: event.slug,
    eventId: event.id,
    generatedAt: new Date().toISOString(),
    safeConfigRoots: ["data/events", "data/access", "public/events"],
    files: [
      `data/events/${event.slug}/event.json`,
      `data/events/${event.slug}/branding.json`,
      `data/events/${event.slug}/attendee.json`,
      `data/events/${event.slug}/agenda.json`,
      `data/events/${event.slug}/speakers.json`,
      `data/events/${event.slug}/sponsors.json`,
      `data/events/${event.slug}/run-of-show.json`,
      `data/events/${event.slug}/video.json`,
      `data/events/${event.slug}/communications.json`,
      "data/access/event-access-config.json",
    ],
    readiness: {
      hasBranding: Boolean(packageConfig.branding?.logo && packageConfig.branding?.hero),
      hasAgenda: Boolean(packageConfig.agenda?.sessions?.length),
      hasAccess: true,
      hasVideo: Boolean(packageConfig.video?.providerLadder?.length),
      hasCommunications: Boolean(packageConfig.communications?.templates?.length),
    },
  };
}
