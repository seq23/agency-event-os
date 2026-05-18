import { describe, expect, it } from "vitest";
import { approvalDecisionSchema } from "@/lib/validation/productionOpsSchemas";

describe("production ops actions contract", () => {
  it("requires event-scoped approval decisions", () => {
    const parsed = approvalDecisionSchema.safeParse({ approvalRequestId: "approval-1", agencyId: "agency-1", clientId: "client-1", eventId: "event-1", decision: "lock", comment: "Approved for show." });
    expect(parsed.success).toBe(true);
  });
});
