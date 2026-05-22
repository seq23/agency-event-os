import eventsIndex from "@/data/events/events.json";
import accessIndex from "@/data/access/event-access-config.json";
import demoEvent from "@/data/events/demo/event.json";
import demoAttendee from "@/data/events/demo/attendee.json";
import demoBranding from "@/data/events/demo/branding.json";
import demoAgenda from "@/data/events/demo/agenda.json";
import demoSpeakers from "@/data/events/demo/speakers.json";
import demoSponsors from "@/data/events/demo/sponsors.json";
import demoRunOfShow from "@/data/events/demo/run-of-show.json";
import demoVideo from "@/data/events/demo/video.json";
import demoCommunications from "@/data/events/demo/communications.json";
import webinarEvent from "@/data/events/leadership-reset-webinar/event.json";
import webinarAttendee from "@/data/events/leadership-reset-webinar/attendee.json";
import webinarBranding from "@/data/events/leadership-reset-webinar/branding.json";
import webinarAgenda from "@/data/events/leadership-reset-webinar/agenda.json";
import webinarSpeakers from "@/data/events/leadership-reset-webinar/speakers.json";
import webinarSponsors from "@/data/events/leadership-reset-webinar/sponsors.json";
import webinarRunOfShow from "@/data/events/leadership-reset-webinar/run-of-show.json";
import webinarVideo from "@/data/events/leadership-reset-webinar/video.json";
import webinarCommunications from "@/data/events/leadership-reset-webinar/communications.json";
import demoDayEvent from "@/data/events/seed-demo-day/event.json";
import demoDayAttendee from "@/data/events/seed-demo-day/attendee.json";
import demoDayBranding from "@/data/events/seed-demo-day/branding.json";
import demoDayAgenda from "@/data/events/seed-demo-day/agenda.json";
import demoDaySpeakers from "@/data/events/seed-demo-day/speakers.json";
import demoDaySponsors from "@/data/events/seed-demo-day/sponsors.json";
import demoDayRunOfShow from "@/data/events/seed-demo-day/run-of-show.json";
import demoDayVideo from "@/data/events/seed-demo-day/video.json";
import demoDayCommunications from "@/data/events/seed-demo-day/communications.json";
import expoEvent from "@/data/events/provider-innovation-expo/event.json";
import expoAttendee from "@/data/events/provider-innovation-expo/attendee.json";
import expoBranding from "@/data/events/provider-innovation-expo/branding.json";
import expoAgenda from "@/data/events/provider-innovation-expo/agenda.json";
import expoSpeakers from "@/data/events/provider-innovation-expo/speakers.json";
import expoSponsors from "@/data/events/provider-innovation-expo/sponsors.json";
import expoRunOfShow from "@/data/events/provider-innovation-expo/run-of-show.json";
import expoVideo from "@/data/events/provider-innovation-expo/video.json";
import expoCommunications from "@/data/events/provider-innovation-expo/communications.json";
import workshopEvent from "@/data/events/premium-workshop-intensive/event.json";
import workshopAttendee from "@/data/events/premium-workshop-intensive/attendee.json";
import workshopBranding from "@/data/events/premium-workshop-intensive/branding.json";
import workshopAgenda from "@/data/events/premium-workshop-intensive/agenda.json";
import workshopSpeakers from "@/data/events/premium-workshop-intensive/speakers.json";
import workshopSponsors from "@/data/events/premium-workshop-intensive/sponsors.json";
import workshopRunOfShow from "@/data/events/premium-workshop-intensive/run-of-show.json";
import workshopVideo from "@/data/events/premium-workshop-intensive/video.json";
import workshopCommunications from "@/data/events/premium-workshop-intensive/communications.json";
import type { V4SpecialGuestRole } from "@/types/v4";
import { getEventSetupDraftByEventCode, getEventSetupDraftRoleCodes } from "@/services/events/eventDraftStore";

export interface EventIndexRecord {
  slug: string;
  eventId: string;
  publicCode: string;
  status: string;
  configPath: string;
}

export interface EventConfigRecord {
  id: string;
  slug: string;
  name: string;
  client: string;
  clientSlug?: string;
  timezone: string;
  state: string;
  publishLifecycle: string;
  publicCode: string;
  runtimeStateBoundary: string;
}

export interface AttendeeConfigRecord {
  eventId: string;
  joinStates: string[];
  defaultDestination: string;
  supportEnabled: boolean;
}

export interface AccessConfigRoleCode {
  role: V4SpecialGuestRole;
  envKey: string;
  destinationTemplate: string;
}

export interface EventAccessConfigRecord {
  eventId: string;
  crewPasswordEnvKey: string;
  specialGuestCodes: AccessConfigRoleCode[];
}


export interface EventConfigPackage {
  event: EventConfigRecord;
  attendee: AttendeeConfigRecord;
  branding: { eventId: string; logo: string; hero: string; theme: string };
  agenda: { eventId: string; sessions: Array<Record<string, string>> };
  speakers: { eventId: string; speakers: Array<Record<string, string>> };
  sponsors: { eventId: string; sponsors: Array<Record<string, string>> };
  runOfShow: { eventId: string; segments: Array<Record<string, string>> };
  video: { eventId: string; providerLadder: string[]; dailyAutomatic: boolean; zoomRequiresCrewConfirmation: boolean; googleMeetManualOnly: boolean; roomLevelOverrides: boolean };
  communications: { eventId: string; templates: string[] };
}

type AccessIndex = { events: Record<string, EventAccessConfigRecord> };

const eventConfigs: Record<string, EventConfigRecord> = {
  demo: demoEvent as EventConfigRecord,
  "leadership-reset-webinar": webinarEvent as EventConfigRecord,
  "seed-demo-day": demoDayEvent as EventConfigRecord,
  "provider-innovation-expo": expoEvent as EventConfigRecord,
  "premium-workshop-intensive": workshopEvent as EventConfigRecord,
};

const attendeeConfigs: Record<string, AttendeeConfigRecord> = {
  demo: demoAttendee as AttendeeConfigRecord,
  "leadership-reset-webinar": webinarAttendee as AttendeeConfigRecord,
  "seed-demo-day": demoDayAttendee as AttendeeConfigRecord,
  "provider-innovation-expo": expoAttendee as AttendeeConfigRecord,
  "premium-workshop-intensive": workshopAttendee as AttendeeConfigRecord,
};


const eventLookupAliases: Record<string, string> = {
  "nova-summit": "demo",
  "nova-founder-summit": "demo",
};

function normalizeEventLookupKey(rawCode: string | undefined) {
  const code = rawCode?.trim().toLowerCase();
  if (!code) return undefined;
  return eventLookupAliases[code] || code;
}

function dynamicEventIndexRecord(code: string | undefined): EventIndexRecord | undefined {
  const draft = getEventSetupDraftByEventCode(code);
  if (!draft) return undefined;
  return {
    slug: draft.eventCode,
    eventId: draft.eventCode,
    publicCode: draft.eventCode,
    status: "registration_open",
    configPath: `.runtime-data/event-drafts.json#${draft.id}`,
  };
}

function dynamicEventConfig(code: string | undefined): EventConfigRecord | undefined {
  const draft = getEventSetupDraftByEventCode(code);
  if (!draft) return undefined;
  return {
    id: draft.eventCode,
    slug: draft.eventCode,
    name: draft.eventName,
    client: draft.clientName,
    clientSlug: draft.clientName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "client",
    timezone: "America/Chicago",
    state: "registration_open",
    publishLifecycle: "test_created_runtime_event",
    publicCode: draft.eventCode,
    runtimeStateBoundary: "event_scoped_runtime",
  };
}

function dynamicAttendeeConfig(code: string | undefined): AttendeeConfigRecord | undefined {
  const event = dynamicEventConfig(code);
  if (!event) return undefined;
  return { eventId: event.id, joinStates: ["registration_open", "live"], defaultDestination: `/venue/${event.id}/lobby`, supportEnabled: true };
}

function dynamicPackageBody(event: EventConfigRecord): Omit<EventConfigPackage, "event" | "attendee"> {
  return {
    branding: { eventId: event.id, logo: "west-peek-live", hero: event.name, theme: "west-peek-live" },
    agenda: { eventId: event.id, sessions: [
      { id: `${event.id}-main-stage`, title: `${event.name} Main Stage`, room: "Main Stage", startsAt: "10:00 AM" },
      { id: `${event.id}-operator-briefing`, title: "Operator briefing", room: "Session Room", startsAt: "11:00 AM" },
    ] },
    speakers: { eventId: event.id, speakers: [
      { id: `${event.id}-speaker`, name: "Playwright Speaker", roleCodeEnvKey: "generated_event_speaker_code" },
    ] },
    sponsors: { eventId: event.id, sponsors: [
      { id: `${event.id}-sponsor`, name: "Playwright Sponsor", headline: "Generated sponsor booth", websiteUrl: "https://westpeek.live" },
    ] },
    runOfShow: { eventId: event.id, segments: [
      { id: `${event.id}-opening`, title: "Opening remarks", startsAt: "10:00 AM", stage: "Main Stage" },
      { id: `${event.id}-stream-check`, title: "StreamYard to LiveKit check", startsAt: "10:10 AM", stage: "Main Stage" },
    ] },
    video: { eventId: event.id, providerLadder: ["StreamYard production feed", "LiveKit embedded distribution", "Daily fallback", "Zoom + Google Meet manual backup"], dailyAutomatic: true, zoomRequiresCrewConfirmation: true, googleMeetManualOnly: true, roomLevelOverrides: true },
    communications: { eventId: event.id, templates: ["attendee_registration", "speaker_instructions", "sponsor_instructions", "crew_call_sheet"] },
  };
}

function dynamicAccessConfig(code: string | undefined): EventAccessConfigRecord | undefined {
  const event = dynamicEventConfig(code);
  if (!event) return undefined;
  return {
    eventId: event.id,
    crewPasswordEnvKey: "CREW_ACCESS_PASSWORD",
    specialGuestCodes: [
      { role: "client", envKey: `GENERATED_${event.id.toUpperCase().replace(/[^A-Z0-9]+/g, "_")}_CLIENT_CODE`, destinationTemplate: "/client/{clientSlug}/events/{eventId}" },
      { role: "speaker", envKey: `GENERATED_${event.id.toUpperCase().replace(/[^A-Z0-9]+/g, "_")}_SPEAKER_CODE`, destinationTemplate: "/speaker/events/{eventId}" },
      { role: "sponsor", envKey: `GENERATED_${event.id.toUpperCase().replace(/[^A-Z0-9]+/g, "_")}_SPONSOR_CODE`, destinationTemplate: "/sponsor/events/{eventId}" },
      { role: "vip", envKey: `GENERATED_${event.id.toUpperCase().replace(/[^A-Z0-9]+/g, "_")}_VIP_CODE`, destinationTemplate: "/venue/{eventId}/lobby" },
      { role: "crew_lite", envKey: `GENERATED_${event.id.toUpperCase().replace(/[^A-Z0-9]+/g, "_")}_CREW_LITE_CODE`, destinationTemplate: "/crew/events/{eventId}" },
    ],
  };
}

export function getGeneratedEventRoleCode(eventCode: string | undefined, role: V4SpecialGuestRole) {
  return getEventSetupDraftRoleCodes(eventCode)[role as keyof ReturnType<typeof getEventSetupDraftRoleCodes>];
}

const eventConfigPackages: Record<string, Omit<EventConfigPackage, "event" | "attendee">> = {
  demo: {
    branding: demoBranding,
    agenda: demoAgenda,
    speakers: demoSpeakers,
    sponsors: demoSponsors,
    runOfShow: demoRunOfShow,
    video: demoVideo,
    communications: demoCommunications,
  } as Omit<EventConfigPackage, "event" | "attendee">,
  "leadership-reset-webinar": {
    branding: webinarBranding,
    agenda: webinarAgenda,
    speakers: webinarSpeakers,
    sponsors: webinarSponsors,
    runOfShow: webinarRunOfShow,
    video: webinarVideo,
    communications: webinarCommunications,
  } as Omit<EventConfigPackage, "event" | "attendee">,
  "seed-demo-day": {
    branding: demoDayBranding,
    agenda: demoDayAgenda,
    speakers: demoDaySpeakers,
    sponsors: demoDaySponsors,
    runOfShow: demoDayRunOfShow,
    video: demoDayVideo,
    communications: demoDayCommunications,
  } as Omit<EventConfigPackage, "event" | "attendee">,
  "provider-innovation-expo": {
    branding: expoBranding,
    agenda: expoAgenda,
    speakers: expoSpeakers,
    sponsors: expoSponsors,
    runOfShow: expoRunOfShow,
    video: expoVideo,
    communications: expoCommunications,
  } as Omit<EventConfigPackage, "event" | "attendee">,
  "premium-workshop-intensive": {
    branding: workshopBranding,
    agenda: workshopAgenda,
    speakers: workshopSpeakers,
    sponsors: workshopSponsors,
    runOfShow: workshopRunOfShow,
    video: workshopVideo,
    communications: workshopCommunications,
  } as Omit<EventConfigPackage, "event" | "attendee">,
};

export function getEventIndex(): EventIndexRecord[] {
  return (eventsIndex as { events: EventIndexRecord[] }).events;
}

export function findEventIndexRecord(rawCode: string | undefined) {
  const code = normalizeEventLookupKey(rawCode);
  if (!code) return undefined;
  return getEventIndex().find((event) => event.slug === code || event.publicCode.toLowerCase() === code || event.eventId.toLowerCase() === code) || dynamicEventIndexRecord(code);
}

export function getEventConfig(slugOrEventId: string | undefined): EventConfigRecord | undefined {
  const code = normalizeEventLookupKey(slugOrEventId);
  if (!code) return undefined;
  const record = getEventIndex().find((item) => item.slug === code || item.eventId === code || item.publicCode.toLowerCase() === code);
  return record ? (eventConfigs[record.slug] || dynamicEventConfig(record.slug)) : (eventConfigs[code] || dynamicEventConfig(code));
}

export function getAttendeeConfig(slugOrEventId: string | undefined): AttendeeConfigRecord | undefined {
  const code = normalizeEventLookupKey(slugOrEventId);
  if (!code) return undefined;
  const record = getEventIndex().find((item) => item.slug === code || item.eventId === code || item.publicCode.toLowerCase() === code);
  return record ? (attendeeConfigs[record.slug] || dynamicAttendeeConfig(record.slug)) : (attendeeConfigs[code] || dynamicAttendeeConfig(code));
}

export function getEventAccessConfig(slug: string): EventAccessConfigRecord | undefined {
  const access = accessIndex as AccessIndex;
  return access.events[slug] || dynamicAccessConfig(slug);
}

export function destinationForRole(role: V4SpecialGuestRole, eventId: string) {
  const record = findEventIndexRecord(eventId);
  const config = getEventConfig(record?.slug || eventId);
  const access = getEventAccessConfig(record?.slug || eventId);
  const roleConfig = access?.specialGuestCodes.find((item) => item.role === role);
  const template = roleConfig?.destinationTemplate;
  if (!template) return `/venue/${eventId}/lobby`;
  return template
    .replaceAll("{eventId}", eventId)
    .replaceAll("{eventSlug}", record?.slug || eventId)
    .replaceAll("{clientSlug}", config?.clientSlug || "client");
}

export function getEventConfigPackage(slugOrEventId: string | undefined): EventConfigPackage {
  const event = getEventConfig(slugOrEventId);
  if (!event) throw new Error(`Event config package missing event record for ${slugOrEventId || "unknown"}.`);
  const attendee = getAttendeeConfig(event.slug);
  if (!attendee) throw new Error(`Event config package missing attendee config for ${event.slug}.`);
  const packageBody = eventConfigPackages[event.slug] || dynamicPackageBody(event);
  if (!packageBody) throw new Error(`Event config package missing files for ${event.slug}.`);
  return { event, attendee, ...packageBody };
}
