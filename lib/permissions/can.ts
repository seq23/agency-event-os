import type { PermissionResource, PermissionUser, UserRole } from "@/types/permissions";
import type { Capability } from "./capabilities";
import { CAPABILITIES } from "./capabilities";
import { AGENCY_SIDE_ROLES, PRODUCTION_COMMAND_ROLES } from "./roles";

function hasRole(user: PermissionUser, roles: UserRole[]): boolean {
  return user.roles.some((role) => roles.includes(role));
}

function inAgency(user: PermissionUser, resource?: PermissionResource): boolean {
  if (!resource?.agencyId) return true;
  return user.agencyIds.includes(resource.agencyId);
}

function assignedToEvent(user: PermissionUser, resource?: PermissionResource): boolean {
  if (!resource?.eventId) return true;
  return Boolean(user.eventIds?.includes(resource.eventId));
}

function clientScoped(user: PermissionUser, resource?: PermissionResource): boolean {
  if (!resource?.clientId) return true;
  return Boolean(user.clientIds?.includes(resource.clientId));
}

function ownOrAssigned(user: PermissionUser, resource?: PermissionResource): boolean {
  if (!resource) return false;
  if (resource.ownerUserId === user.id) return true;
  if (resource.assignedUserIds?.includes(user.id)) return true;
  if (resource.contractorAssignmentId && user.contractorAssignmentIds?.includes(resource.contractorAssignmentId)) return true;
  if (resource.vendorAssignmentId && user.vendorAssignmentIds?.includes(resource.vendorAssignmentId)) return true;
  if (resource.speakerProfileId && user.speakerProfileIds?.includes(resource.speakerProfileId)) return true;
  if (resource.sponsorId && user.sponsorIds?.includes(resource.sponsorId)) return true;
  if (resource.attendeeId && user.attendeeIds?.includes(resource.attendeeId)) return true;
  return false;
}

function agencySide(user: PermissionUser, resource?: PermissionResource): boolean {
  return hasRole(user, AGENCY_SIDE_ROLES) && inAgency(user, resource);
}

function assignedAgencyOperator(user: PermissionUser, resource?: PermissionResource): boolean {
  if (!agencySide(user, resource)) return false;
  if (hasRole(user, ["agency_owner", "agency_admin", "finance"])) return true;
  return assignedToEvent(user, resource);
}

export function can(user: PermissionUser | null | undefined, action: Capability | string, resource?: PermissionResource): boolean {
  if (!user) return false;

  const ownerOrAdmin = hasRole(user, ["agency_owner", "agency_admin"]) && inAgency(user, resource);
  if (ownerOrAdmin) {
    if (resource?.locked && (action === CAPABILITIES.APPROVAL_APPROVE || action === CAPABILITIES.RUN_OF_SHOW_EDIT)) {
      return hasRole(user, ["agency_owner"]);
    }
    return true;
  }

  if (action.startsWith("agency.")) {
    return hasRole(user, ["agency_owner", "agency_admin"]) && inAgency(user, resource);
  }

  if (action.startsWith("client.")) {
    if (hasRole(user, ["client_owner", "client_reviewer"])) {
      return clientScoped(user, resource) && (resource?.clientVisible || resource?.visibility === "client_facing" || action === CAPABILITIES.CLIENT_VIEW_PORTAL);
    }
    return agencySide(user, resource);
  }

  if (action.startsWith("event.")) {
    if (hasRole(user, ["client_owner", "client_reviewer"])) {
      return clientScoped(user, resource) && (resource?.clientVisible || resource?.visibility === "client_facing" || action === CAPABILITIES.EVENT_VIEW_CLIENT_FACING);
    }
    if (hasRole(user, ["contractor", "vendor", "speaker", "sponsor_admin", "sponsor_representative", "attendee"])) {
      return ownOrAssigned(user, resource);
    }
    return assignedAgencyOperator(user, resource);
  }

  if (action.startsWith("production.")) {
    return hasRole(user, PRODUCTION_COMMAND_ROLES) && inAgency(user, resource) && assignedToEvent(user, resource);
  }

  if (action.startsWith("run_of_show.")) {
    if (action === CAPABILITIES.RUN_OF_SHOW_VIEW_CLIENT_FACING) {
      return clientScoped(user, resource) && Boolean(resource?.clientVisible);
    }
    if (hasRole(user, ["contractor", "speaker", "sponsor_admin", "sponsor_representative"])) {
      return ownOrAssigned(user, resource);
    }
    return assignedAgencyOperator(user, resource);
  }

  if (action.startsWith("task.")) {
    if (hasRole(user, ["contractor", "vendor"])) return ownOrAssigned(user, resource);
    return assignedAgencyOperator(user, resource);
  }

  if (action.startsWith("contractor.")) {
    if (hasRole(user, ["contractor"])) return ownOrAssigned(user, resource);
    return assignedAgencyOperator(user, resource);
  }

  if (action.startsWith("vendor.")) {
    if (hasRole(user, ["vendor"])) return ownOrAssigned(user, resource);
    return assignedAgencyOperator(user, resource);
  }

  if (action.startsWith("speaker.")) {
    if (hasRole(user, ["speaker"])) return ownOrAssigned(user, resource);
    return assignedAgencyOperator(user, resource);
  }

  if (action.startsWith("sponsor.")) {
    if (hasRole(user, ["sponsor_admin", "sponsor_representative"])) return ownOrAssigned(user, resource);
    return assignedAgencyOperator(user, resource);
  }

  if (action.startsWith("venue.")) {
    if (hasRole(user, ["attendee", "speaker", "sponsor_admin", "sponsor_representative"])) return ownOrAssigned(user, resource);
    return agencySide(user, resource);
  }

  if (action.startsWith("moderation.")) {
    return hasRole(user, ["agency_owner", "agency_admin", "producer", "moderator"]) && assignedToEvent(user, resource);
  }

  if (action.startsWith("analytics.")) {
    if (hasRole(user, ["client_owner"])) return clientScoped(user, resource) && Boolean(resource?.clientVisible);
    if (hasRole(user, ["sponsor_admin"])) return ownOrAssigned(user, resource);
    return assignedAgencyOperator(user, resource);
  }

  if (action.startsWith("finance.")) {
    return hasRole(user, ["agency_owner", "finance"]) && inAgency(user, resource);
  }

  if (action.startsWith("audit.")) {
    return assignedAgencyOperator(user, resource) || ownOrAssigned(user, resource);
  }

  return false;
}
