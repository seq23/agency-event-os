import { isSupabaseAdminConfigured } from "@/lib/env";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

/**
 * Public event-request intake.
 *
 * This used to write a JSON file under `.runtime-data/` via `require("fs")`,
 * which cannot work on the Worker this site is deployed to, and — worse — could
 * not report that it had not worked. `appendRequestEventRecord` returned the
 * record it was handed on both the success and the failure path, so the caller
 * had no way to tell a stored request from a discarded one, and the visitor was
 * shown "Request received" either way.
 *
 * On Cloudflare the filesystem branch was not even a silent no-op. With this
 * project's `compatibility_date` (2024-12-30, i.e. before the 2025-09-15 cutoff
 * that enables native `node:fs`) and no `enable_nodejs_fs_module` flag, wrangler
 * resolves `fs` to unenv's polyfill. That polyfill's `existsSync` returns false
 * and its `mkdirSync`/`writeFileSync`/`renameSync` throw
 * "[unenv] fs.mkdirSync is not implemented yet!". The object is truthy, so the
 * `if (!fs) return` guard did not fire and the write threw instead — taking the
 * notification email down with it, since the throw happened before `sendEmail`.
 *
 * Bumping the compatibility date would only convert that crash into a genuine
 * silent drop: workerd's filesystem is per-isolate and ephemeral, so a request
 * written to it is gone as soon as the isolate is recycled. Intake has to go
 * somewhere durable, so it goes to Supabase, which every other persisted
 * surface in this app already uses.
 *
 * The contract this file now keeps: a caller can always tell whether the
 * request was stored. Nothing here reports success it did not observe.
 */

declare const process: { env: Record<string, string | undefined> };

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

/**
 * The outcome of an intake write. `ok: false` always carries a machine-readable
 * reason so the caller can log precisely why a request was not stored rather
 * than guessing.
 */
export type RequestEventPersistResult =
  | { ok: true; record: RequestEventRecord }
  | { ok: false; record: RequestEventRecord; reason: string };

const TABLE = "request_event_intake";

type RequestEventRow = {
  id: string;
  name: string;
  email: string;
  company: string | null;
  event_type: string | null;
  event_date: string | null;
  audience_size: string | null;
  livestream_needs: string | null;
  networking_needs: string | null;
  sponsor_expo_needs: string | null;
  speaker_count: string | null;
  support_level: string | null;
  notes: string | null;
  created_at: string;
};

/** Empty strings are what the form sends for untouched optional fields. */
const orNull = (value: string | undefined) => (value && value.trim() ? value.trim() : null);

function toRow(record: RequestEventRecord): RequestEventRow {
  return {
    id: record.id,
    name: record.name,
    email: record.email,
    company: orNull(record.company),
    event_type: orNull(record.eventType),
    event_date: orNull(record.eventDate),
    audience_size: orNull(record.audienceSize),
    livestream_needs: orNull(record.livestreamNeeds),
    networking_needs: orNull(record.networkingNeeds),
    sponsor_expo_needs: orNull(record.sponsorExpoNeeds),
    speaker_count: orNull(record.speakerCount),
    support_level: orNull(record.supportLevel),
    notes: orNull(record.notes),
    created_at: record.createdAt,
  };
}

function fromRow(row: RequestEventRow): RequestEventRecord {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    company: row.company ?? undefined,
    eventType: row.event_type ?? undefined,
    eventDate: row.event_date ?? undefined,
    audienceSize: row.audience_size ?? undefined,
    livestreamNeeds: row.livestream_needs ?? undefined,
    networkingNeeds: row.networking_needs ?? undefined,
    sponsorExpoNeeds: row.sponsor_expo_needs ?? undefined,
    speakerCount: row.speaker_count ?? undefined,
    supportLevel: row.support_level ?? undefined,
    notes: row.notes ?? undefined,
    createdAt: row.created_at,
  };
}

const errorMessage = (error: unknown) => (error instanceof Error ? error.message : String(error));

/**
 * Read intake records back. Previously this always returned `[]` on the Worker,
 * because unenv's `existsSync` is hardcoded to false — and it was called from
 * inside the append path, so a working filesystem would have caused an append to
 * truncate every earlier record. Both problems disappear with a real insert.
 */
export async function readRequestEventRecords(): Promise<RequestEventRecord[]> {
  if (!isSupabaseAdminConfigured()) return [];

  const { data, error } = await createSupabaseAdminClient()
    .from(TABLE)
    .select("*")
    .order("created_at", { ascending: true });

  if (error) throw new Error(`Failed to read ${TABLE}: ${error.message}`);

  return ((data ?? []) as RequestEventRow[]).map(fromRow);
}

/**
 * Store one event request. Never throws: the caller needs a decision about what
 * to show the visitor, not an exception, and an intake path that can 500 is an
 * intake path that loses requests. Every failure comes back as `ok: false` with
 * a reason.
 */
export async function appendRequestEventRecord(
  record: RequestEventRecord,
): Promise<RequestEventPersistResult> {
  if (!isSupabaseAdminConfigured()) {
    return { ok: false, record, reason: "supabase_not_configured" };
  }

  try {
    const { error } = await createSupabaseAdminClient().from(TABLE).insert(toRow(record));

    if (error) return { ok: false, record, reason: `insert_failed:${error.message}` };

    return { ok: true, record };
  } catch (error) {
    return { ok: false, record, reason: `insert_threw:${errorMessage(error)}` };
  }
}
