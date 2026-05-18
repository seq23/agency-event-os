import { describe, expect, it } from "vitest";
import { resolvePermissionUser } from "@/lib/auth/accessResolver";

const profile = {
  id: "user-1",
  email: "producer@example.com",
  full_name: "Producer One",
  status: "active",
};

describe("access resolver", () => {
  it("normalizes memberships, assignments, and scoped ids into PermissionUser", () => {
    const user = resolvePermissionUser({
      profile,
      agencyMembers: [{ id: "am-1", agency_id: "agency-1", user_id: "user-1", role: "producer", status: "active" }],
      roleAssignments: [{ id: "ra-1", user_id: "user-1", role: "technical_director", scope_type: "event", scope_id: "event-1", agency_id: "agency-1", client_id: "client-1", event_id: "event-1", status: "active" }],
      clientContacts: [],
      contractorAssignmentIds: ["contractor-assignment-1"],
      vendorAssignmentIds: [],
      speakerProfileIds: [],
      sponsorIds: [],
      eventIds: ["event-1"],
    });

    expect(user.id).toBe("user-1");
    expect(user.roles).toContain("producer");
    expect(user.roles).toContain("technical_director");
    expect(user.agencyIds).toContain("agency-1");
    expect(user.clientIds).toContain("client-1");
    expect(user.eventIds).toContain("event-1");
  });
});
