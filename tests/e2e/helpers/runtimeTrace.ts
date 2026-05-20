import fs from "node:fs";
import path from "node:path";
import { expect } from "@playwright/test";

const runtimePath = () => process.env.AGENCY_EVENT_OS_RUNTIME_STORE_PATH || path.join(process.cwd(), ".runtime-data", "local-playwright-runtime.json");
const eventDraftPath = () => path.join(process.cwd(), ".runtime-data", "event-drafts.json");

export function resetRuntimeTraceFiles() {
  fs.mkdirSync(path.dirname(runtimePath()), { recursive: true });
  fs.writeFileSync(runtimePath(), `${JSON.stringify({
    auditLogs: [],
    accessAttempts: [],
    analyticsEvents: [],
    fallbackEvents: [],
    fallbackStates: [],
    incidentEvents: [],
    supportRequests: [],
    emailEvents: [],
    registrations: [],
    runOfShowEvents: [],
  }, null, 2)}\n`, "utf8");
  fs.writeFileSync(eventDraftPath(), "[]\n", "utf8");
}

export function readRuntimeSnapshot(): any {
  if (!fs.existsSync(runtimePath())) return {};
  return JSON.parse(fs.readFileSync(runtimePath(), "utf8"));
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
