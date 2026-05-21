import type { SupabaseClient } from "@supabase/supabase-js";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { AuditLog } from "@/types/core";
import type { V4AnalyticsEvent, V4RoomFallbackState } from "@/types/v4";
import type { StageStreamEvent, StageStreamState } from "@/types/stageStream";
import type { LiveChatMessage } from "@/types/liveChat";
import type { AttendeeLiveCapability, AttendeeLiveControlState } from "@/types/attendeeLive";
import type { AttendeeProfile } from "@/types/attendeeRegistration";
import type { AttendeeAgendaIntent, AttendeePermission, AttendeeSession, SponsorLeadOptIn } from "@/types/attendeeSession";
import { emptyRuntimeSnapshot, type RuntimeStore, type V5AccessAttemptRuntimeEvent, type V5FallbackRuntimeEvent, type V6EmailRuntimeEvent, type V6IncidentRuntimeEvent, type V6RegistrationRuntimeEvent, type V6RunOfShowRuntimeEvent, type V6RuntimeSnapshot, type V6SupportRequestRuntimeEvent } from "./runtimeStore";


function mapAttendeeProfile(row: Record<string, unknown>): AttendeeProfile {
  return { attendeeId: String(row.attendee_id || ""), eventId: String(row.event_id || ""), emailHash: String(row.email_hash || ""), name: String(row.name || ""), emailMasked: row.email_masked ? String(row.email_masked) : undefined, company: String(row.company || ""), title: String(row.title || ""), personalWebsite: row.personal_website ? String(row.personal_website) : undefined, socialLinks: Array.isArray(row.social_links) ? row.social_links.map(String) : [], reasonForAttending: row.reason_for_attending ? String(row.reason_for_attending) : undefined, interestingFact: row.interesting_fact ? String(row.interesting_fact) : undefined, topicsOfInterest: Array.isArray(row.topics_of_interest) ? row.topics_of_interest.map(String) : [], networkingGoals: row.networking_goals ? String(row.networking_goals) : undefined, networkingOptIn: Boolean(row.networking_opt_in), role: "attendee", status: (row.status as AttendeeProfile["status"]) || "active", createdAt: String(row.created_at || ""), updatedAt: String(row.updated_at || "") };
}

function mapAttendeeSession(row: Record<string, unknown>): AttendeeSession {
  return { sessionId: String(row.session_id || ""), attendeeId: String(row.attendee_id || ""), eventId: String(row.event_id || ""), role: "attendee", status: (row.status as AttendeeSession["status"]) || "active", issuedAt: String(row.issued_at || ""), expiresAt: String(row.expires_at || ""), lastSeenAt: row.last_seen_at ? String(row.last_seen_at) : undefined };
}

function mapAttendeeAgendaIntent(row: Record<string, unknown>): AttendeeAgendaIntent {
  return { id: String(row.id || ""), attendeeId: String(row.attendee_id || ""), eventId: String(row.event_id || ""), plannedSessionIds: Array.isArray(row.planned_session_ids) ? row.planned_session_ids.map(String) : [], plannedBreakoutIds: Array.isArray(row.planned_breakout_ids) ? row.planned_breakout_ids.map(String) : [], plannedSponsorBoothIds: Array.isArray(row.planned_sponsor_booth_ids) ? row.planned_sponsor_booth_ids.map(String) : [], wantsSessionReminders: Boolean(row.wants_session_reminders), updatedAt: String(row.updated_at || "") };
}

function fail(message: string): never {
  throw new Error(`Supabase runtime store failed: ${message}`);
}

async function insertRecord<T>(client: SupabaseClient, table: string, payload: Record<string, unknown>, original: T): Promise<T> {
  const { error } = await client.from(table).insert(payload);
  if (error) fail(`${table}: ${error.message}`);
  return original;
}

async function selectAll<T>(client: SupabaseClient, table: string, columns = "*", orderColumn = "created_at"): Promise<T[]> {
  const query = client.from(table).select(columns).order(orderColumn, { ascending: true });
  const { data, error } = await query;
  if (error) fail(`${table} read: ${error.message}`);
  return (data || []) as T[];
}

export class SupabaseRuntimeStore implements RuntimeStore {
  private readonly client: SupabaseClient;

  constructor(client = createSupabaseAdminClient()) {
    this.client = client;
  }

  appendAuditLog(log: AuditLog) {
    return insertRecord(this.client, "audit_logs", {
      id: log.id,
      agency_id: log.agencyId,
      client_id: log.clientId,
      event_id: log.eventId,
      actor_user_id: log.actorUserId,
      actor_role: log.actorRole,
      action: log.action,
      resource_type: log.resourceType,
      resource_id: log.resourceId,
      visibility: log.visibility,
      created_at: log.createdAt,
    }, log);
  }

  appendAccessAttempt(event: V5AccessAttemptRuntimeEvent) {
    return insertRecord(this.client, "v5_access_attempt_events", {
      id: event.id,
      status: event.status,
      access_kind: event.accessKind,
      event_id: event.eventId,
      role: event.role,
      route: event.route,
      reason: event.reason,
      ip_hash: event.ipHash,
      user_agent_hash: event.userAgentHash,
      created_at: event.createdAt,
    }, event);
  }

  appendAnalyticsEvent(event: V4AnalyticsEvent) {
    return insertRecord(this.client, "v5_analytics_events", {
      id: event.id,
      event_id: event.eventId,
      kind: event.kind,
      subject_id: event.subjectId,
      metadata: event.metadata || {},
      created_at: event.createdAt,
    }, event);
  }

  appendFallbackEvent(event: V5FallbackRuntimeEvent) {
    return insertRecord(this.client, "v5_runtime_fallback_events", {
      id: event.id,
      event_id: event.eventId,
      room_id: event.roomId,
      room_type: event.roomType,
      provider: event.provider,
      action: event.action,
      actor_role: event.actorRole,
      reason: event.reason,
      created_at: event.createdAt,
    }, event);
  }

  async getFallbackState(key: string) {
    const [eventId, roomType] = key.split(":");
    const { data, error } = await this.client
      .from("v6_room_fallback_states")
      .select("state")
      .eq("event_id", eventId)
      .eq("room_type", roomType)
      .maybeSingle();
    if (error) fail(`v6_room_fallback_states read: ${error.message}`);
    return data?.state as V4RoomFallbackState | undefined;
  }

  async setFallbackState(key: string, state: V4RoomFallbackState) {
    const [eventId, roomType] = key.split(":");
    const { error } = await this.client.from("v6_room_fallback_states").upsert({
      event_id: eventId,
      room_type: roomType,
      state,
      updated_at: new Date().toISOString(),
    });
    if (error) fail(`v6_room_fallback_states upsert: ${error.message}`);
    return state;
  }

  appendIncident(event: V6IncidentRuntimeEvent) {
    return insertRecord(this.client, "v6_incident_events", {
      id: event.id,
      event_id: event.eventId,
      title: event.title,
      severity: event.severity,
      status: event.status,
      owner_role: event.ownerRole,
      details: event.details,
      created_at: event.createdAt,
    }, event);
  }

  appendSupportRequest(event: V6SupportRequestRuntimeEvent) {
    return insertRecord(this.client, "v6_support_requests", {
      id: event.id,
      event_id: event.eventId,
      attendee_id: event.attendeeId,
      subject: event.subject,
      status: event.status,
      created_at: event.createdAt,
    }, event);
  }

  appendEmailEvent(event: V6EmailRuntimeEvent) {
    return insertRecord(this.client, "v6_email_events", {
      id: event.id,
      event_id: event.eventId,
      template_key: event.templateKey,
      recipient_segment: event.recipientSegment,
      status: event.status,
      provider_message_id: event.providerMessageId,
      reason: event.reason,
      created_at: event.createdAt,
    }, event);
  }

  appendRegistration(event: V6RegistrationRuntimeEvent) {
    return insertRecord(this.client, "v6_registration_events", {
      id: event.id,
      event_id: event.eventId,
      attendee_email_hash: event.attendeeEmailHash,
      status: event.status,
      display_name: event.displayName,
      company: event.company,
      title: event.title,
      personal_website: event.personalWebsite,
      social_links: event.socialLinks || [],
      reason_for_attending: event.reasonForAttending,
      interesting_fact: event.interestingFact,
      created_at: event.createdAt,
    }, event);
  }


  async upsertAttendeeProfile(profile: AttendeeProfile) {
    const { error } = await this.client.from("attendee_profiles").upsert({
      attendee_id: profile.attendeeId, event_id: profile.eventId, email_hash: profile.emailHash, name: profile.name, email_masked: profile.emailMasked, company: profile.company, title: profile.title, personal_website: profile.personalWebsite, social_links: profile.socialLinks || [], reason_for_attending: profile.reasonForAttending, interesting_fact: profile.interestingFact, topics_of_interest: profile.topicsOfInterest || [], networking_goals: profile.networkingGoals, networking_opt_in: profile.networkingOptIn, role: profile.role, status: profile.status, created_at: profile.createdAt, updated_at: profile.updatedAt,
    });
    if (error) fail(`attendee_profiles upsert: ${error.message}`);
    return profile;
  }

  async getAttendeeProfile(eventId: string, attendeeId: string) {
    const { data, error } = await this.client.from("attendee_profiles").select("*").eq("event_id", eventId).eq("attendee_id", attendeeId).maybeSingle();
    if (error) fail(`attendee_profiles read: ${error.message}`);
    return data ? mapAttendeeProfile(data as Record<string, unknown>) : undefined;
  }

  async getAttendeeProfileByEmailHash(eventId: string, emailHash: string) {
    const { data, error } = await this.client.from("attendee_profiles").select("*").eq("event_id", eventId).eq("email_hash", emailHash).maybeSingle();
    if (error) fail(`attendee_profiles email read: ${error.message}`);
    return data ? mapAttendeeProfile(data as Record<string, unknown>) : undefined;
  }

  async listAttendeeProfiles(eventId: string, limit = 100) {
    const { data, error } = await this.client.from("attendee_profiles").select("*").eq("event_id", eventId).eq("status", "active").order("updated_at", { ascending: false }).limit(limit);
    if (error) fail(`attendee_profiles list: ${error.message}`);
    return (data || []).map((row) => mapAttendeeProfile(row as Record<string, unknown>));
  }

  async upsertAttendeeSession(session: AttendeeSession) {
    const { error } = await this.client.from("attendee_sessions").upsert({ session_id: session.sessionId, attendee_id: session.attendeeId, event_id: session.eventId, role: session.role, status: session.status, issued_at: session.issuedAt, expires_at: session.expiresAt, last_seen_at: session.lastSeenAt });
    if (error) fail(`attendee_sessions upsert: ${error.message}`);
    return session;
  }

  async getAttendeeSession(eventId: string, sessionId: string) {
    const { data, error } = await this.client.from("attendee_sessions").select("*").eq("event_id", eventId).eq("session_id", sessionId).maybeSingle();
    if (error) fail(`attendee_sessions read: ${error.message}`);
    return data ? mapAttendeeSession(data as Record<string, unknown>) : undefined;
  }

  async upsertAttendeeAgendaIntent(intent: AttendeeAgendaIntent) {
    const { error } = await this.client.from("attendee_agenda_intents").upsert({ id: intent.id, attendee_id: intent.attendeeId, event_id: intent.eventId, planned_session_ids: intent.plannedSessionIds, planned_breakout_ids: intent.plannedBreakoutIds, planned_sponsor_booth_ids: intent.plannedSponsorBoothIds, wants_session_reminders: intent.wantsSessionReminders, updated_at: intent.updatedAt });
    if (error) fail(`attendee_agenda_intents upsert: ${error.message}`);
    return intent;
  }

  async getAttendeeAgendaIntent(eventId: string, attendeeId: string) {
    const { data, error } = await this.client.from("attendee_agenda_intents").select("*").eq("event_id", eventId).eq("attendee_id", attendeeId).maybeSingle();
    if (error) fail(`attendee_agenda_intents read: ${error.message}`);
    return data ? mapAttendeeAgendaIntent(data as Record<string, unknown>) : undefined;
  }

  async appendSponsorLeadOptIn(optIn: SponsorLeadOptIn) {
    return insertRecord(this.client, "sponsor_lead_opt_ins", { id: optIn.id, attendee_id: optIn.attendeeId, event_id: optIn.eventId, sponsor_booth_id: optIn.sponsorBoothId, allowed_fields: optIn.allowedFields, created_at: optIn.createdAt }, optIn);
  }



  async upsertAttendeePermission(permission: AttendeePermission) {
    const { error } = await this.client.from("attendee_permissions").upsert({ id: permission.id, attendee_id: permission.attendeeId, event_id: permission.eventId, permission_kind: permission.permissionKind, granted: permission.granted, granted_by: permission.grantedBy, reason: permission.reason, updated_at: permission.updatedAt });
    if (error) fail(`attendee_permissions upsert: ${error.message}`);
    return permission;
  }

  async listAttendeePermissions(eventId: string, attendeeId: string) {
    const { data, error } = await this.client.from("attendee_permissions").select("*").eq("event_id", eventId).eq("attendee_id", attendeeId);
    if (error) fail(`attendee_permissions list: ${error.message}`);
    return (data || []).map((row: Record<string, unknown>) => ({ id: String(row.id || ""), attendeeId: String(row.attendee_id || ""), eventId: String(row.event_id || ""), permissionKind: row.permission_kind as AttendeePermission["permissionKind"], granted: Boolean(row.granted), grantedBy: row.granted_by ? String(row.granted_by) : undefined, reason: row.reason ? String(row.reason) : undefined, updatedAt: String(row.updated_at || "") }));
  }

  appendRunOfShowEvent(event: V6RunOfShowRuntimeEvent) {
    return insertRecord(this.client, "v6_run_of_show_runtime_events", {
      id: event.id,
      event_id: event.eventId,
      segment_id: event.segmentId,
      action: event.action,
      actor_role: event.actorRole,
      created_at: event.createdAt,
    }, event);
  }



  async getStageStreamState(key: string) {
    const [eventId, stageId] = key.split(":");
    const { data, error } = await this.client.from("stage_stream_states").select("state").eq("event_id", eventId).eq("stage_id", stageId).maybeSingle();
    if (error) fail(`stage_stream_states read: ${error.message}`);
    return data?.state as StageStreamState | undefined;
  }

  async setStageStreamState(key: string, state: StageStreamState) {
    const [eventId, stageId] = key.split(":");
    const { error } = await this.client.from("stage_stream_states").upsert({ event_id: eventId, stage_id: stageId, state, updated_at: new Date().toISOString() });
    if (error) fail(`stage_stream_states upsert: ${error.message}`);
    return state;
  }

  appendStageStreamEvent(event: StageStreamEvent) {
    return insertRecord(this.client, "stage_stream_events", { id: event.id, event_id: event.eventId, stage_id: event.stageId, signal: event.signal, state_event: event, created_at: event.createdAt }, event);
  }

  appendLiveChatMessage(message: LiveChatMessage) {
    return insertRecord(this.client, "live_chat_messages", { id: message.id, event_id: message.eventId, room_kind: message.roomKind, room_id: message.roomId, attendee_id: message.attendeeId, display_name: message.displayName, company: message.company, message: message.message, moderation_status: message.moderationStatus, created_at: message.createdAt }, message);
  }

  async listLiveChatMessages(eventId: string, roomKind: string, roomId: string) {
    const { data, error } = await this.client.from("live_chat_messages").select("*").eq("event_id", eventId).eq("room_kind", roomKind).eq("room_id", roomId).neq("moderation_status", "hidden").order("created_at", { ascending: true });
    if (error) fail(`live_chat_messages read: ${error.message}`);
    return (data || []).map((row: Record<string, unknown>) => ({ id: String(row.id), eventId: String(row.event_id), roomKind: row.room_kind as LiveChatMessage["roomKind"], roomId: String(row.room_id), attendeeId: row.attendee_id ? String(row.attendee_id) : undefined, displayName: String(row.display_name || "Attendee"), company: row.company ? String(row.company) : undefined, message: String(row.message || ""), moderationStatus: (row.moderation_status as LiveChatMessage["moderationStatus"]) || "visible", createdAt: String(row.created_at || "") }));
  }

  async setAttendeeLiveCapability(key: string, capability: AttendeeLiveCapability) {
    const { error } = await this.client.from("attendee_live_capabilities").upsert({ key, event_id: capability.eventId, room_kind: capability.roomKind, room_id: capability.roomId, attendee_id: capability.attendeeId, capability, updated_at: capability.updatedAt });
    if (error) fail(`attendee_live_capabilities upsert: ${error.message}`);
    return capability;
  }

  async getAttendeeLiveCapability(key: string) {
    const { data, error } = await this.client.from("attendee_live_capabilities").select("capability").eq("key", key).maybeSingle();
    if (error) fail(`attendee_live_capabilities read: ${error.message}`);
    return data?.capability as AttendeeLiveCapability | undefined;
  }

  async setAttendeeLiveControlState(key: string, state: AttendeeLiveControlState) {
    const { error } = await this.client.from("attendee_live_control_states").upsert({ key, event_id: state.eventId, room_kind: state.roomKind, room_id: state.roomId, state, updated_at: state.updatedAt });
    if (error) fail(`attendee_live_control_states upsert: ${error.message}`);
    return state;
  }

  async getAttendeeLiveControlState(key: string) {
    const { data, error } = await this.client.from("attendee_live_control_states").select("state").eq("key", key).maybeSingle();
    if (error) fail(`attendee_live_control_states read: ${error.message}`);
    return data?.state as AttendeeLiveControlState | undefined;
  }

  async readSnapshot(): Promise<V6RuntimeSnapshot> {
    const snapshot = emptyRuntimeSnapshot();
    const [auditLogs, accessAttempts, analyticsEvents, fallbackEvents, fallbackStates, incidentEvents, supportRequests, emailEvents, registrations, attendeeProfiles, attendeeSessions, attendeeAgendaIntents, sponsorLeadOptIns, attendeePermissions, runOfShowEvents, stageStreamStates, stageStreamEvents, liveChatMessages, attendeeLiveCapabilities, attendeeLiveControlStates] = await Promise.all([
      selectAll<Record<string, unknown>>(this.client, "audit_logs"),
      selectAll<Record<string, unknown>>(this.client, "v5_access_attempt_events"),
      selectAll<Record<string, unknown>>(this.client, "v5_analytics_events"),
      selectAll<Record<string, unknown>>(this.client, "v5_runtime_fallback_events"),
      selectAll<Record<string, unknown>>(this.client, "v6_room_fallback_states", "*", "updated_at"),
      selectAll<Record<string, unknown>>(this.client, "v6_incident_events"),
      selectAll<Record<string, unknown>>(this.client, "v6_support_requests"),
      selectAll<Record<string, unknown>>(this.client, "v6_email_events"),
      selectAll<Record<string, unknown>>(this.client, "v6_registration_events"),
      selectAll<Record<string, unknown>>(this.client, "attendee_profiles", "*", "updated_at"),
      selectAll<Record<string, unknown>>(this.client, "attendee_sessions", "*", "issued_at"),
      selectAll<Record<string, unknown>>(this.client, "attendee_agenda_intents", "*", "updated_at"),
      selectAll<Record<string, unknown>>(this.client, "sponsor_lead_opt_ins"),
      selectAll<Record<string, unknown>>(this.client, "attendee_permissions", "*", "updated_at"),
      selectAll<Record<string, unknown>>(this.client, "v6_run_of_show_runtime_events"),
      selectAll<Record<string, unknown>>(this.client, "stage_stream_states", "*", "updated_at"),
      selectAll<Record<string, unknown>>(this.client, "stage_stream_events"),
      selectAll<Record<string, unknown>>(this.client, "live_chat_messages"),
      selectAll<Record<string, unknown>>(this.client, "attendee_live_capabilities", "*", "updated_at"),
      selectAll<Record<string, unknown>>(this.client, "attendee_live_control_states", "*", "updated_at"),
    ]);

    snapshot.auditLogs = auditLogs.map((row) => ({
      id: String(row.id),
      agencyId: String(row.agency_id || ""),
      clientId: row.client_id ? String(row.client_id) : undefined,
      eventId: row.event_id ? String(row.event_id) : undefined,
      actorUserId: String(row.actor_user_id || ""),
      actorRole: String(row.actor_role || ""),
      action: String(row.action || ""),
      resourceType: String(row.resource_type || ""),
      resourceId: String(row.resource_id || ""),
      createdAt: String(row.created_at || ""),
      visibility: (row.visibility as AuditLog["visibility"]) || "internal_agency",
    }));
    snapshot.accessAttempts = accessAttempts.map((row) => ({
      id: String(row.id),
      status: row.status as V5AccessAttemptRuntimeEvent["status"],
      accessKind: row.access_kind as V5AccessAttemptRuntimeEvent["accessKind"],
      eventId: row.event_id ? String(row.event_id) : undefined,
      role: row.role ? String(row.role) : undefined,
      route: row.route ? String(row.route) : undefined,
      reason: row.reason ? String(row.reason) : undefined,
      ipHash: row.ip_hash ? String(row.ip_hash) : undefined,
      userAgentHash: row.user_agent_hash ? String(row.user_agent_hash) : undefined,
      createdAt: String(row.created_at || ""),
    }));
    snapshot.analyticsEvents = analyticsEvents.map((row) => ({
      id: String(row.id),
      eventId: String(row.event_id || ""),
      kind: row.kind as V4AnalyticsEvent["kind"],
      subjectId: row.subject_id ? String(row.subject_id) : undefined,
      metadata: (row.metadata as V4AnalyticsEvent["metadata"]) || {},
      createdAt: String(row.created_at || ""),
    }));
    snapshot.fallbackEvents = fallbackEvents.map((row) => ({
      id: String(row.id),
      eventId: String(row.event_id || ""),
      roomId: String(row.room_id || ""),
      roomType: String(row.room_type || ""),
      provider: row.provider as V5FallbackRuntimeEvent["provider"],
      action: row.action as V5FallbackRuntimeEvent["action"],
      actorRole: row.actor_role ? String(row.actor_role) : undefined,
      reason: row.reason ? String(row.reason) : undefined,
      createdAt: String(row.created_at || ""),
    }));
    snapshot.fallbackStates = fallbackStates.map((row) => row.state as V4RoomFallbackState).filter(Boolean);
    snapshot.incidentEvents = incidentEvents.map((row) => ({
      id: String(row.id),
      eventId: String(row.event_id || ""),
      title: String(row.title || ""),
      severity: row.severity as V6IncidentRuntimeEvent["severity"],
      status: row.status as V6IncidentRuntimeEvent["status"],
      ownerRole: String(row.owner_role || ""),
      details: String(row.details || ""),
      createdAt: String(row.created_at || ""),
    }));
    snapshot.supportRequests = supportRequests.map((row) => ({
      id: String(row.id),
      eventId: String(row.event_id || ""),
      attendeeId: row.attendee_id ? String(row.attendee_id) : undefined,
      subject: String(row.subject || ""),
      status: row.status as V6SupportRequestRuntimeEvent["status"],
      createdAt: String(row.created_at || ""),
    }));
    snapshot.emailEvents = emailEvents.map((row) => ({
      id: String(row.id),
      eventId: String(row.event_id || ""),
      templateKey: String(row.template_key || ""),
      recipientSegment: String(row.recipient_segment || ""),
      status: row.status as V6EmailRuntimeEvent["status"],
      providerMessageId: row.provider_message_id ? String(row.provider_message_id) : undefined,
      reason: row.reason ? String(row.reason) : undefined,
      createdAt: String(row.created_at || ""),
    }));
    snapshot.registrations = registrations.map((row) => ({
      id: String(row.id),
      eventId: String(row.event_id || ""),
      attendeeEmailHash: String(row.attendee_email_hash || ""),
      status: row.status as V6RegistrationRuntimeEvent["status"],
      displayName: row.display_name ? String(row.display_name) : undefined,
      company: row.company ? String(row.company) : undefined,
      title: row.title ? String(row.title) : undefined,
      personalWebsite: row.personal_website ? String(row.personal_website) : undefined,
      socialLinks: Array.isArray(row.social_links) ? row.social_links.map(String) : [],
      reasonForAttending: row.reason_for_attending ? String(row.reason_for_attending) : undefined,
      interestingFact: row.interesting_fact ? String(row.interesting_fact) : undefined,
      createdAt: String(row.created_at || ""),
    }));
    snapshot.attendeeProfiles = attendeeProfiles.map((row) => mapAttendeeProfile(row));
    snapshot.attendeeSessions = attendeeSessions.map((row) => mapAttendeeSession(row));
    snapshot.attendeeAgendaIntents = attendeeAgendaIntents.map((row) => mapAttendeeAgendaIntent(row));
    snapshot.sponsorLeadOptIns = sponsorLeadOptIns.map((row) => ({ id: String(row.id), attendeeId: String(row.attendee_id || ""), eventId: String(row.event_id || ""), sponsorBoothId: String(row.sponsor_booth_id || ""), allowedFields: Array.isArray(row.allowed_fields) ? row.allowed_fields.map(String) : [], createdAt: String(row.created_at || "") }));
    snapshot.attendeePermissions = attendeePermissions.map((row) => ({ id: String(row.id || ""), attendeeId: String(row.attendee_id || ""), eventId: String(row.event_id || ""), permissionKind: row.permission_kind as AttendeePermission["permissionKind"], granted: Boolean(row.granted), grantedBy: row.granted_by ? String(row.granted_by) : undefined, reason: row.reason ? String(row.reason) : undefined, updatedAt: String(row.updated_at || "") }));
    snapshot.runOfShowEvents = runOfShowEvents.map((row) => ({
      id: String(row.id),
      eventId: String(row.event_id || ""),
      segmentId: String(row.segment_id || ""),
      action: row.action as V6RunOfShowRuntimeEvent["action"],
      actorRole: String(row.actor_role || ""),
      createdAt: String(row.created_at || ""),
    }));
    snapshot.stageStreamStates = stageStreamStates.map((row) => row.state as StageStreamState).filter(Boolean);
    snapshot.stageStreamEvents = stageStreamEvents.map((row) => row.state_event as StageStreamEvent).filter(Boolean);
    snapshot.liveChatMessages = liveChatMessages.map((row) => ({ id: String(row.id), eventId: String(row.event_id || ""), roomKind: row.room_kind as LiveChatMessage["roomKind"], roomId: String(row.room_id || ""), attendeeId: row.attendee_id ? String(row.attendee_id) : undefined, displayName: String(row.display_name || "Attendee"), company: row.company ? String(row.company) : undefined, message: String(row.message || ""), moderationStatus: (row.moderation_status as LiveChatMessage["moderationStatus"]) || "visible", createdAt: String(row.created_at || "") }));
    snapshot.attendeeLiveCapabilities = attendeeLiveCapabilities.map((row) => row.capability as AttendeeLiveCapability).filter(Boolean);
    snapshot.attendeeLiveControlStates = attendeeLiveControlStates.map((row) => row.state as AttendeeLiveControlState).filter(Boolean);
    return snapshot;
  }
}
