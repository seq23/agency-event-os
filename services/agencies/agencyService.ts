import type { SupabaseClient } from "@supabase/supabase-js";
import type { DbAgencyRecord } from "@/types/persistence";
import { mapAgencyRecord } from "@/services/persistence/mapRecords";

export async function listAgenciesForUser(client: SupabaseClient, userId: string) {
  const { data, error } = await client
    .from("agency_members")
    .select("agencies(*)")
    .eq("user_id", userId)
    .eq("status", "active");

  if (error) return { error: error.message, data: [] };

  const agencies = ((data ?? []) as Array<{ agencies: DbAgencyRecord | DbAgencyRecord[] | null }>).flatMap((row) => {
    if (!row.agencies) return [];
    return Array.isArray(row.agencies) ? row.agencies : [row.agencies];
  });

  return { data: agencies.map(mapAgencyRecord) };
}

export async function getAgencyById(client: SupabaseClient, agencyId: string) {
  const { data, error } = await client.from("agencies").select("*").eq("id", agencyId).maybeSingle();
  if (error) return { error: error.message };
  return { data: data ? mapAgencyRecord(data as DbAgencyRecord) : undefined };
}
