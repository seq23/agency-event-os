import type { SupabaseClient } from "@supabase/supabase-js";
import type { QueryHealthCheck, QuerySurface, SupabaseQueryResult } from "@/types/supabaseQueryIntegration";

export async function fetchTableRows<T>(
  supabase: SupabaseClient,
  tableName: string,
  options: { eventId?: string; limit?: number } = {},
): Promise<SupabaseQueryResult<T>> {
  let query = supabase.from(tableName).select("*");

  if (options.eventId) {
    query = query.eq("event_id", options.eventId);
  }

  if (options.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;

  if (error) {
    return { data: [], source: "supabase", error: error.message };
  }

  return { data: (data ?? []) as T[], source: "supabase" };
}

export function buildQueryHealthCheck(surface: QuerySurface, status: QueryHealthCheck["status"], details: Record<string, unknown> = {}): QueryHealthCheck {
  return {
    surface,
    status,
    details,
    checkedAt: new Date().toISOString(),
  };
}

export function useRuntimeSeedFallback<T>(data: T[], reason: string): SupabaseQueryResult<T> {
  return {
    data,
    source: "runtime_seed",
    error: reason,
  };
}
