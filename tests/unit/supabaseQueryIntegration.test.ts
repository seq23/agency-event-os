import { describe, expect, it } from "vitest";
import { buildQueryHealthCheck, useRuntimeSeedFallback } from "@/services/supabase-query";

describe("supabase query integration", () => {
  it("builds query health checks and seed fallback results", () => {
    const health = buildQueryHealthCheck("venue", "ok", { rows: 3 });
    expect(health.surface).toBe("venue");
    expect(health.status).toBe("ok");

    const fallback = useRuntimeSeedFallback([{ id: "row-1" }], "No Supabase rows found yet.");
    expect(fallback.source).toBe("runtime_seed");
    expect(fallback.data).toHaveLength(1);
  });
});
