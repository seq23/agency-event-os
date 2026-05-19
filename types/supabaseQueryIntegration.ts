export type QuerySurface =
  | "dashboard"
  | "venue"
  | "sessions"
  | "expo"
  | "networking"
  | "replay"
  | "reports"
  | "production"
  | "assets";

export interface QueryHealthCheck {
  surface: QuerySurface;
  status: "ok" | "using_seed_fallback" | "error";
  details: Record<string, unknown>;
  checkedAt: string;
}

export interface SupabaseQueryResult<T> {
  data: T[];
  source: "supabase" | "runtime_seed";
  error?: string;
}
