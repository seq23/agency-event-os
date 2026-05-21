declare const require: undefined | ((moduleName: string) => unknown);

export interface RequestEventRecord {
  id: string;
  name: string;
  email: string;
  company?: string;
  eventType?: string;
  eventDate?: string;
  audienceSize?: string;
  livestreamNeeds?: string;
  networkingNeeds?: string;
  sponsorExpoNeeds?: string;
  speakerCount?: string;
  supportLevel?: string;
  notes?: string;
  createdAt: string;
}

const requestEventPath = `${process.cwd()}/.runtime-data/request-event-intake.json`;

function getFs(): { existsSync: (path: string) => boolean; mkdirSync: (path: string, options: { recursive: boolean }) => void; readFileSync: (path: string, encoding: string) => string; renameSync: (from: string, to: string) => void; writeFileSync: (path: string, body: string, encoding: string) => void } | undefined {
  try {
    if (typeof require !== "function") return undefined;
    return require("fs") as ReturnType<typeof getFs>;
  } catch {
    return undefined;
  }
}

function getPath(): { dirname: (path: string) => string } | undefined {
  try {
    if (typeof require !== "function") return undefined;
    return require("path") as ReturnType<typeof getPath>;
  } catch {
    return undefined;
  }
}

export function readRequestEventRecords(): RequestEventRecord[] {
  const fs = getFs();
  if (!fs || !fs.existsSync(requestEventPath)) return [];
  const parsed = JSON.parse(fs.readFileSync(requestEventPath, "utf8")) as RequestEventRecord[];
  return Array.isArray(parsed) ? parsed : [];
}

export function appendRequestEventRecord(record: RequestEventRecord) {
  const fs = getFs();
  const path = getPath();
  if (!fs || !path) return record;
  const records = readRequestEventRecords();
  records.push(record);
  fs.mkdirSync(path.dirname(requestEventPath), { recursive: true });
  const tmp = `${requestEventPath}.${process.pid}.${Date.now()}.tmp`;
  fs.writeFileSync(tmp, `${JSON.stringify(records, null, 2)}\n`, "utf8");
  fs.renameSync(tmp, requestEventPath);
  return record;
}
