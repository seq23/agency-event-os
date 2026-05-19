import type { AuditLog } from "@/types/core";
import type { V4AnalyticsEvent, V4RoomFallbackState } from "@/types/v4";
import { emptyRuntimeSnapshot, type V5AccessAttemptRuntimeEvent, type V5FallbackRuntimeEvent, type V6EmailRuntimeEvent, type V6IncidentRuntimeEvent, type V6RegistrationRuntimeEvent, type V6RunOfShowRuntimeEvent, type V6RuntimeSnapshot, type V6SupportRequestRuntimeEvent } from "./runtimeStore";

declare const require: undefined | ((moduleName: string) => unknown);

let memorySnapshot = emptyRuntimeSnapshot();
const runtimeFilePath = process.env.AGENCY_EVENT_OS_RUNTIME_STORE_PATH || `${process.cwd()}/.runtime-data/agency-event-os-runtime.json`;

function getNodeFs(): { existsSync: (path: string) => boolean; mkdirSync: (path: string, options: { recursive: boolean }) => void; readFileSync: (path: string, encoding: string) => string; renameSync: (from: string, to: string) => void; writeFileSync: (path: string, body: string, encoding: string) => void } | undefined {
  try {
    if (typeof require !== "function") return undefined;
    return require("fs") as ReturnType<typeof getNodeFs>;
  } catch {
    return undefined;
  }
}

function getNodePath(): { dirname: (path: string) => string } | undefined {
  try {
    if (typeof require !== "function") return undefined;
    return require("path") as ReturnType<typeof getNodePath>;
  } catch {
    return undefined;
  }
}

function readSnapshot(): V6RuntimeSnapshot {
  const fs = getNodeFs();
  if (!fs) return memorySnapshot;
  if (!fs.existsSync(runtimeFilePath)) return emptyRuntimeSnapshot();
  const parsed = JSON.parse(fs.readFileSync(runtimeFilePath, "utf8")) as Partial<V6RuntimeSnapshot>;
  return { ...emptyRuntimeSnapshot(), ...parsed };
}

function writeSnapshot(snapshot: V6RuntimeSnapshot) {
  const fs = getNodeFs();
  const path = getNodePath();
  if (!fs || !path) {
    memorySnapshot = snapshot;
    return;
  }
  fs.mkdirSync(path.dirname(runtimeFilePath), { recursive: true });
  const tmp = `${runtimeFilePath}.${process.pid}.${Date.now()}.tmp`;
  fs.writeFileSync(tmp, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");
  fs.renameSync(tmp, runtimeFilePath);
}

function mutate<T>(write: (snapshot: V6RuntimeSnapshot) => T) {
  const snapshot = readSnapshot();
  const result = write(snapshot);
  writeSnapshot(snapshot);
  return result;
}

export type { V5AccessAttemptRuntimeEvent, V5FallbackRuntimeEvent, V6EmailRuntimeEvent, V6IncidentRuntimeEvent, V6RegistrationRuntimeEvent, V6RunOfShowRuntimeEvent, V6RuntimeSnapshot };

export function appendRuntimeAuditLog(log: AuditLog) {
  return mutate((snapshot) => {
    snapshot.auditLogs.push(log);
    return log;
  });
}

export function appendAccessAttempt(event: V5AccessAttemptRuntimeEvent) {
  return mutate((snapshot) => {
    snapshot.accessAttempts.push(event);
    return event;
  });
}

export function appendAnalyticsEvent(event: V4AnalyticsEvent) {
  return mutate((snapshot) => {
    snapshot.analyticsEvents.push(event);
    return event;
  });
}

export function appendFallbackEvent(event: V5FallbackRuntimeEvent) {
  return mutate((snapshot) => {
    snapshot.fallbackEvents.push(event);
    return event;
  });
}

export function getFallbackState(key: string) {
  return readSnapshot().fallbackStates.find((state) => `${state.eventId}:${state.roomType}` === key);
}

export function setFallbackState(key: string, state: V4RoomFallbackState) {
  return mutate((snapshot) => {
    snapshot.fallbackStates = snapshot.fallbackStates.filter((item) => `${item.eventId}:${item.roomType}` !== key);
    snapshot.fallbackStates.push(state);
    return state;
  });
}

export function appendIncidentEvent(event: V6IncidentRuntimeEvent) {
  return mutate((snapshot) => {
    snapshot.incidentEvents.push(event);
    return event;
  });
}

export function appendSupportRequest(event: V6SupportRequestRuntimeEvent) {
  return mutate((snapshot) => {
    snapshot.supportRequests.push(event);
    return event;
  });
}

export function appendEmailEvent(event: V6EmailRuntimeEvent) {
  return mutate((snapshot) => {
    snapshot.emailEvents.push(event);
    return event;
  });
}

export function appendRegistrationEvent(event: V6RegistrationRuntimeEvent) {
  return mutate((snapshot) => {
    snapshot.registrations.push(event);
    return event;
  });
}

export function appendRunOfShowRuntimeEvent(event: V6RunOfShowRuntimeEvent) {
  return mutate((snapshot) => {
    snapshot.runOfShowEvents.push(event);
    return event;
  });
}

export function readV5RuntimeStateSnapshot() {
  return readSnapshot();
}

export function clearV5RuntimeStateForTests() {
  memorySnapshot = emptyRuntimeSnapshot();
  writeSnapshot(emptyRuntimeSnapshot());
}

export const runtimePersistenceMode = "file-backed-runtime-store-with-memory-fallback";
