import { describe, expect, it } from "vitest";
import { createAuditLog } from "@/services/audit";

describe("audit service", () => {
  it("creates a mock audit log entry", async () => {
    const entry = await createAuditLog({
      agencyId: "agency-wpp",
      clientId: "client-nova",
      eventId: "event-summit",
      actorUserId: "user-sequoia",
      actorRole: "agency_owner",
      action: "client_approval_requested",
      resourceType: "approval_request",
      resourceId: "approval-ros",
    });

    expect(entry.agencyId).toBe("agency-wpp");
    expect(entry.action).toBe("client_approval_requested");
    expect(entry.visibility).toBe("internal_agency");
  });
});
