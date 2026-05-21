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
