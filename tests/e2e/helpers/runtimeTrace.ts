import fs from "node:fs";
import path from "node:path";
import { expect } from "@playwright/test";

const runtimePath = () => process.env.AGENCY_EVENT_OS_RUNTIME_STORE_PATH || path.join(process.cwd(), ".runtime-data", "local-playwright-runtime.json");
const eventDraftPath = () => path.join(process.cwd(), ".runtime-data", "event-drafts.json");

export function emptyTraceSnapshot() {
  return {
    auditLogs: [],
    accessAttempts: [],
    analyticsEvents: [],
    fallbackEvents: [],
    fallbackStates: [],
    incidentEvents: [],
    supportRequests: [],
    emailEvents: [],
    registrations: [],
    attendeeProfiles: [],
    attendeeSessions: [],
    attendeeAgendaIntents: [],
    sponsorLeadOptIns: [],
    runOfShowEvents: [],
    stageStreamStates: [],
    stageStreamEvents: [],
    liveChatMessages: [],
    attendeeLiveCapabilities: [],
    attendeeLiveControlStates: [],
    networkingQueue: [],
    helpRequests: [],
  };
}

export function resetRuntimeTraceFiles() {
  fs.mkdirSync(path.dirname(runtimePath()), { recursive: true });
  fs.mkdirSync(path.dirname(eventDraftPath()), { recursive: true });
  fs.writeFileSync(runtimePath(), `${JSON.stringify(emptyTraceSnapshot(), null, 2)}\n`, "utf8");
  fs.writeFileSync(eventDraftPath(), "[]\n", "utf8");
}

export function readRuntimeSnapshot(): any {
  if (!fs.existsSync(runtimePath())) return emptyTraceSnapshot();
  return { ...emptyTraceSnapshot(), ...JSON.parse(fs.readFileSync(runtimePath(), "utf8")) };
}

export function readEventDrafts(): any[] {
  if (!fs.existsSync(eventDraftPath())) return [];
  const parsed = JSON.parse(fs.readFileSync(eventDraftPath(), "utf8"));
  return Array.isArray(parsed) ? parsed : [];
}

export async function expectEventuallyRuntime(predicate: (snapshot: any) => boolean, label: string) {
  await expect.poll(() => predicate(readRuntimeSnapshot()), { message: label, timeout: 10_000 }).toBe(true);
}

export async function expectEventuallyDraft(predicate: (drafts: any[]) => boolean, label: string) {
  await expect.poll(() => predicate(readEventDrafts()), { message: label, timeout: 10_000 }).toBe(true);
}

export function runtimeCollections(snapshot = readRuntimeSnapshot()) {
  return {
    attendeeProfiles: snapshot.attendeeProfiles || [],
    attendeeSessions: snapshot.attendeeSessions || [],
    plannedSessions: snapshot.attendeeAgendaIntents || [],
    chatMessages: snapshot.liveChatMessages || [],
    helpRequests: snapshot.supportRequests || snapshot.helpRequests || [],
    sponsorLeads: snapshot.sponsorLeadOptIns || [],
    stageStreamStates: snapshot.stageStreamStates || [],
    attendeeLivePermissions: snapshot.attendeeLiveCapabilities || [],
    auditEvents: snapshot.auditLogs || [],
  };
}
