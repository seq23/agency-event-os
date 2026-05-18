import { describe, expect, it } from "vitest";
import { approvalDecisionSchema, lastMinuteChangeDecisionSchema, productionInboxDecisionSchema } from "@/lib/validation/productionOpsSchemas";

describe("production ops schemas", () => {
  it("validates approval decisions", () => {
    expect(approvalDecisionSchema.parse({ approvalRequestId: "approval-1", agencyId: "agency-1", clientId: "client-1", eventId: "event-1", decision: "approve" }).decision).toBe("approve");
  });
  it("rejects unsafe inbox statuses", () => {
    expect(() => productionInboxDecisionSchema.parse({ inboxItemId: "i", agencyId: "a", eventId: "e", nextStatus: "delete_forever" })).toThrow();
  });
  it("validates live-change decisions", () => {
    expect(lastMinuteChangeDecisionSchema.parse({ changeRequestId: "c", agencyId: "a", clientId: "cl", eventId: "e", decision: "push_to_live" }).decision).toBe("push_to_live");
  });
});
