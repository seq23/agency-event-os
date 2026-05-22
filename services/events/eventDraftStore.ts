declare const require: undefined | ((moduleName: string) => unknown);

export type EventDraft = {
  id: string;
  createdAt: string;
  eventName: string;
  eventCode: string;
  clientName: string;
  eventDate: string;
  audience: string;
  eventType: string;
  productionFeed: string;
  primaryVideo: string;
  fallbackVideo: string;
};

type FsLike = { existsSync: (path: string) => boolean; mkdirSync: (path: string, options: { recursive: boolean }) => void; readFileSync: (path: string, encoding: string) => string; writeFileSync: (path: string, body: string, encoding: string) => void; renameSync: (from: string, to: string) => void; };
type PathLike = { dirname: (path: string) => string; join: (...parts: string[]) => string; };

let memoryDrafts: EventDraft[] = [];

function getFs(): FsLike | undefined { try { return typeof require === "function" ? require("fs") as FsLike : undefined; } catch { return undefined; } }
function getPath(): PathLike | undefined { try { return typeof require === "function" ? require("path") as PathLike : undefined; } catch { return undefined; } }
function draftPath() { const path = getPath(); return path ? path.join(process.cwd(), ".runtime-data", "event-drafts.json") : "event-drafts-memory.json"; }
function slugify(value: string) { return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80) || "event-draft"; }
function field(formData: FormData, key: string, fallback = "") { return String(formData.get(key) ?? fallback).trim(); }
function readDrafts(filePath: string) { const fs = getFs(); if (!fs) return [...memoryDrafts]; if (!fs.existsSync(filePath)) return []; const parsed = JSON.parse(fs.readFileSync(filePath, "utf8")); return Array.isArray(parsed) ? parsed as EventDraft[] : []; }
function writeDrafts(filePath: string, drafts: EventDraft[]) { const fs = getFs(); const path = getPath(); if (!fs || !path) { memoryDrafts = [...drafts]; return; } fs.mkdirSync(path.dirname(filePath), { recursive: true }); const tmp = `${filePath}.${process.pid}.${Date.now()}.tmp`; fs.writeFileSync(tmp, `${JSON.stringify(drafts, null, 2)}\n`, "utf8"); fs.renameSync(tmp, filePath); }

export function createEventSetupDraft(formData: FormData) {
  const now = new Date().toISOString();
  const eventName = field(formData, "eventName", "Untitled Event");
  const eventCode = slugify(field(formData, "eventCode", eventName));
  const draft: EventDraft = {
    id: `draft-${eventCode}-${Date.now()}`,
    createdAt: now,
    eventName,
    eventCode,
    clientName: field(formData, "clientName", "West Peek Productions"),
    eventDate: field(formData, "eventDate", ""),
    audience: field(formData, "audience", "Guests, speakers, sponsors, VIPs"),
    eventType: field(formData, "eventType", "webinar"),
    productionFeed: field(formData, "productionFeed", "StreamYard"),
    primaryVideo: field(formData, "primaryVideo", "LiveKit"),
    fallbackVideo: field(formData, "fallbackVideo", "Daily, then Zoom + Google Meet"),
  };
  const filePath = draftPath();
  try {
    const drafts = readDrafts(filePath);
    drafts.push(draft);
    writeDrafts(filePath, drafts);
  } catch {
    // Cloudflare Workers and other serverless runtimes may not allow durable local filesystem writes.
    // Event creation must still continue into the operator setup journey instead of crashing.
    memoryDrafts = [...memoryDrafts.filter((existing) => existing.id !== draft.id), draft];
  }
  return draft;
}


export function getEventSetupDraftById(id: string) {
  const filePath = draftPath();
  return readDrafts(filePath).find((draft) => draft.id === id);
}

export function getEventSetupDraftByEventCode(eventCode: string | undefined) {
  const code = slugify(String(eventCode || ""));
  if (!code) return undefined;
  const filePath = draftPath();
  return readDrafts(filePath).slice().reverse().find((draft) => draft.eventCode === code);
}

function titleCaseSlug(slug: string) {
  return slug.split("-").filter(Boolean).map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join("-");
}

export function getEventSetupDraftRoleCodes(eventCode: string | undefined) {
  const code = slugify(String(eventCode || ""));
  const prefix = titleCaseSlug(code || "Draft-Event");
  return {
    client: `${prefix}-Client-2026!`,
    speaker: `${prefix}-Speaker-2026!`,
    sponsor: `${prefix}-Sponsor-2026!`,
    vip: `${prefix}-VIP-2026!`,
    crew_lite: `${prefix}-CrewLite-2026!`,
  } as const;
}


export const EVENT_SETUP_DRAFT_COOKIE_NAME = "wpl_event_setup_draft";

export function encodeEventSetupDraftCookie(draft: EventDraft) {
  return Buffer.from(JSON.stringify(draft), "utf8").toString("base64url");
}

export function decodeEventSetupDraftCookie(value?: string) {
  if (!value) return undefined;
  try {
    const parsed = JSON.parse(Buffer.from(value, "base64url").toString("utf8"));
    if (!parsed || typeof parsed !== "object" || typeof parsed.id !== "string") return undefined;
    return parsed as EventDraft;
  } catch {
    return undefined;
  }
}
