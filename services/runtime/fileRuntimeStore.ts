import type { AuditLog } from "@/types/core";
import type { V4AnalyticsEvent, V4RoomFallbackState } from "@/types/v4";
import { emptyRuntimeSnapshot, type RuntimeStore, type V5AccessAttemptRuntimeEvent, type V5FallbackRuntimeEvent, type V6EmailRuntimeEvent, type V6IncidentRuntimeEvent, type V6RegistrationRuntimeEvent, type V6RunOfShowRuntimeEvent, type V6RuntimeSnapshot, type V6SupportRequestRuntimeEvent } from "./runtimeStore";

declare const require: undefined | ((moduleName: string) => unknown);

type FsLike = {
  existsSync: (path: string) => boolean;
  mkdirSync: (path: string, options: { recursive: boolean }) => void;
  readFileSync: (path: string, encoding: string) => string;
  renameSync: (from: string, to: string) => void;
  writeFileSync: (path: string, body: string, encoding: string) => void;
};

type PathLike = {
  dirname: (path: string) => string;
  join: (...parts: string[]) => string;
};

let memorySnapshot = emptyRuntimeSnapshot();

function getNodeFs(): FsLike | undefined {
  try {
    if (typeof require !== "function") return undefined;
    return require("fs") as FsLike;
  } catch {
    return undefined;
  }
}

function getNodePath(): PathLike | undefined {
  try {
    if (typeof require !== "function") return undefined;
    return require("path") as PathLike;
  } catch {
    return undefined;
  }
}

function defaultRuntimePath() {
  const path = getNodePath();
  return path ? path.join(process.cwd(), ".runtime-data", "agency-event-os-runtime.json") : "agency-event-os-runtime-memory-only.json";
}

function cloneSnapshot(snapshot: V6RuntimeSnapshot): V6RuntimeSnapshot {
  return JSON.parse(JSON.stringify(snapshot)) as V6RuntimeSnapshot;
}

function readSnapshotFile(filePath: string): V6RuntimeSnapshot {
  const fs = getNodeFs();
  if (!fs) return cloneSnapshot(memorySnapshot);
  if (!fs.existsSync(filePath)) return emptyRuntimeSnapshot();
  const parsed = JSON.parse(fs.readFileSync(filePath, "utf8")) as Partial<V6RuntimeSnapshot>;
  return {
    ...emptyRuntimeSnapshot(),
    ...parsed,
    fallbackStates: Array.isArray(parsed.fallbackStates) ? parsed.fallbackStates : [],
  };
}

function writeSnapshotFile(filePath: string, snapshot: V6RuntimeSnapshot) {
  const fs = getNodeFs();
  const path = getNodePath();
  if (!fs || !path) {
    memorySnapshot = cloneSnapshot(snapshot);
    return;
  }
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const tmp = `${filePath}.${process.pid}.${Date.now()}.tmp`;
  fs.writeFileSync(tmp, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");
  fs.renameSync(tmp, filePath);
}

export class FileRuntimeStore implements RuntimeStore {
  private readonly filePath: string;

  constructor(filePath = process.env.AGENCY_EVENT_OS_RUNTIME_STORE_PATH || defaultRuntimePath()) {
    this.filePath = filePath;
  }

  private read() {
    return readSnapshotFile(this.filePath);
  }

  private write(snapshot: V6RuntimeSnapshot) {
    writeSnapshotFile(this.filePath, snapshot);
  }

  async appendAuditLog(log: AuditLog) {
    const snapshot = this.read();
    snapshot.auditLogs.push(log);
    this.write(snapshot);
    return log;
  }

  async appendAccessAttempt(event: V5AccessAttemptRuntimeEvent) {
    const snapshot = this.read();
    snapshot.accessAttempts.push(event);
    this.write(snapshot);
    return event;
  }

  async appendAnalyticsEvent(event: V4AnalyticsEvent) {
    const snapshot = this.read();
    snapshot.analyticsEvents.push(event);
    this.write(snapshot);
    return event;
  }

  async appendFallbackEvent(event: V5FallbackRuntimeEvent) {
    const snapshot = this.read();
    snapshot.fallbackEvents.push(event);
    this.write(snapshot);
    return event;
  }

  async getFallbackState(key: string) {
    const snapshot = this.read();
    return snapshot.fallbackStates.find((state) => `${state.eventId}:${state.roomType}` === key);
  }

  async setFallbackState(key: string, state: V4RoomFallbackState) {
    const snapshot = this.read();
    snapshot.fallbackStates = snapshot.fallbackStates.filter((item) => `${item.eventId}:${item.roomType}` !== key);
    snapshot.fallbackStates.push(state);
    this.write(snapshot);
    return state;
  }

  async appendIncident(event: V6IncidentRuntimeEvent) {
    const snapshot = this.read();
    snapshot.incidentEvents.push(event);
    this.write(snapshot);
    return event;
  }

  async appendSupportRequest(event: V6SupportRequestRuntimeEvent) {
    const snapshot = this.read();
    snapshot.supportRequests.push(event);
    this.write(snapshot);
    return event;
  }

  async appendEmailEvent(event: V6EmailRuntimeEvent) {
    const snapshot = this.read();
    snapshot.emailEvents.push(event);
    this.write(snapshot);
    return event;
  }

  async appendRegistration(event: V6RegistrationRuntimeEvent) {
    const snapshot = this.read();
    snapshot.registrations.push(event);
    this.write(snapshot);
    return event;
  }

  async appendRunOfShowEvent(event: V6RunOfShowRuntimeEvent) {
    const snapshot = this.read();
    snapshot.runOfShowEvents.push(event);
    this.write(snapshot);
    return event;
  }

  async readSnapshot() {
    return cloneSnapshot(this.read());
  }
}
