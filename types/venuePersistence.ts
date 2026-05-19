export type AttendeeRegistrationStatus = "invited" | "registered" | "checked_in" | "cancelled" | "blocked";
export type SessionStatus = "draft" | "scheduled" | "live" | "completed" | "cancelled";
export type ExpoBoothStatus = "draft" | "ready" | "live" | "archived";

export interface AttendeeRecord {
  id: string;
  agencyId: string;
  clientId?: string;
  eventId: string;
  displayName: string;
  email: string;
  company?: string;
  title?: string;
  registrationStatus: AttendeeRegistrationStatus;
  attendeeType: string;
  networkingOptIn: boolean;
}

export interface EventSessionRecord {
  id: string;
  agencyId: string;
  clientId?: string;
  eventId: string;
  videoRoomId?: string;
  title: string;
  description?: string;
  sessionType: string;
  startsAt?: string;
  endsAt?: string;
  visibility: "public" | "registered" | "private";
  status: SessionStatus;
  sortOrder: number;
}

export interface ExpoBoothRecord {
  id: string;
  agencyId: string;
  clientId?: string;
  eventId: string;
  sponsorId?: string;
  videoRoomId?: string;
  name: string;
  headline?: string;
  description?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  sortOrder: number;
  status: ExpoBoothStatus;
}

export interface VenueReadModel {
  eventId: string;
  attendees: AttendeeRecord[];
  sessions: EventSessionRecord[];
  expoBooths: ExpoBoothRecord[];
  replayCount: number;
  qAndACount: number;
  pollCount: number;
}
