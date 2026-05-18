import { describe, expect, it } from "vitest";
import { mapAgencyRecord, mapClientRecord, mapEventRecord } from "@/services/persistence";

const agency = { id: "a1", name: "Agency", slug: "agency", status: "active" as const, owner_user_id: "u1" };
const client = { id: "c1", agency_id: "a1", name: "Client", slug: "client", industry: "VC", status: "active" as const, primary_contact_name: "Elena", primary_contact_email: "elena@example.com" };
const event = { id: "e1", agency_id: "a1", client_id: "c1", name: "Summit", slug: "summit", event_type: "virtual_summit", status: "draft", timezone: "America/Chicago", registration_enabled: true, venue_enabled: true, replay_enabled: true, reporting_enabled: true };

describe("persistence record mapping", () => {
  it("maps agency, client, and event database records into domain models", () => {
    expect(mapAgencyRecord(agency).ownerUserId).toBe("u1");
    expect(mapClientRecord(client).primaryContactEmail).toBe("elena@example.com");
    expect(mapEventRecord(event).eventType).toBe("virtual_summit");
  });
});
