import type { UserRole } from "@/types/permissions";

export const ROLES: Record<string, UserRole> = {
  AGENCY_OWNER: "agency_owner",
  AGENCY_ADMIN: "agency_admin",
  EXECUTIVE_PRODUCER: "executive_producer",
  PRODUCER: "producer",
  PROJECT_MANAGER: "project_manager",
  TECHNICAL_DIRECTOR: "technical_director",
  MODERATOR: "moderator",
  CONTRACTOR: "contractor",
  VENDOR: "vendor",
  CLIENT_OWNER: "client_owner",
  CLIENT_REVIEWER: "client_reviewer",
  SPEAKER: "speaker",
  SPONSOR_ADMIN: "sponsor_admin",
  SPONSOR_REPRESENTATIVE: "sponsor_representative",
  ATTENDEE: "attendee",
  FINANCE: "finance",
};

export const AGENCY_SIDE_ROLES: UserRole[] = [
  "agency_owner",
  "agency_admin",
  "executive_producer",
  "producer",
  "project_manager",
  "technical_director",
  "moderator",
  "finance",
];

export const PRODUCTION_COMMAND_ROLES: UserRole[] = [
  "agency_owner",
  "agency_admin",
  "executive_producer",
  "producer",
  "technical_director",
  "moderator",
];
