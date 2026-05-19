import { getEnv, isSupabaseAdminConfigured } from "@/lib/env";
import { FileRuntimeStore } from "./fileRuntimeStore";
import { SupabaseRuntimeStore } from "./supabaseRuntimeStore";
import type { RuntimeStore } from "./runtimeStore";

let runtimeStore: RuntimeStore | undefined;

const isProductionBuild = process.env.NEXT_PHASE === "phase-production-build" || process.env.npm_lifecycle_event === "build";

export function getRuntimeStore() {
  if (runtimeStore) return runtimeStore;
  const env = getEnv();
  const strategy = process.env.AGENCY_EVENT_OS_RUNTIME_STORE || (isSupabaseAdminConfigured(env) ? "supabase" : "file");
  if (process.env.NODE_ENV === "production" && !isProductionBuild && strategy === "file" && process.env.ALLOW_FILE_RUNTIME_STORE_IN_PRODUCTION !== "true") {
    throw new Error("Production runtime persistence requires Supabase or ALLOW_FILE_RUNTIME_STORE_IN_PRODUCTION=true for an explicit file-store deployment.");
  }
  runtimeStore = strategy === "supabase" ? new SupabaseRuntimeStore() : new FileRuntimeStore();
  return runtimeStore;
}

export function setRuntimeStoreForTests(store: RuntimeStore | undefined) {
  runtimeStore = store;
}
