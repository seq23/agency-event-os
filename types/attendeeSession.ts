export interface AttendeeSession {
  sessionId: string;
  attendeeId: string;
  eventId: string;
  role: "attendee";
  status: "active" | "revoked" | "expired";
  issuedAt: string;
  expiresAt: string;
  lastSeenAt?: string;
}

export interface AttendeeAgendaIntent {
  id: string;
  attendeeId: string;
  eventId: string;
  plannedSessionIds: string[];
  plannedBreakoutIds: string[];
  plannedSponsorBoothIds: string[];
  wantsSessionReminders: boolean;
  updatedAt: string;
}

export interface SponsorLeadOptIn {
  id: string;
  attendeeId: string;
  eventId: string;
  sponsorBoothId: string;
  allowedFields: string[];
  createdAt: string;
}


export interface AttendeePermission {
  id: string;
  attendeeId: string;
  eventId: string;
  permissionKind: "venue_access" | "chat" | "networking" | "help" | "sponsor_opt_in" | "stage_publish" | "restricted_session";
  granted: boolean;
  grantedBy?: string;
  reason?: string;
  updatedAt: string;
}
