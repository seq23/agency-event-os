import { describe, expect, it } from "vitest";
import { buildVenueReadModel, mapAttendeeRecord, mapEventSessionRecord, mapExpoBoothRecord } from "@/services/venue";

describe("venue persistence", () => {
  it("maps attendee, session, and expo records", () => {
    const attendee = mapAttendeeRecord({
      id: "attendee-1",
      agency_id: "agency-1",
      event_id: "event-1",
      display_name: "Ava Attendee",
      email: "ava@example.com",
      registration_status: "registered",
      attendee_type: "general",
      networking_opt_in: true,
    });

    const session = mapEventSessionRecord({
      id: "session-1",
      agency_id: "agency-1",
      event_id: "event-1",
      title: "Opening",
      session_type: "keynote",
      visibility: "public",
      status: "scheduled",
      sort_order: 2,
    });

    const booth = mapExpoBoothRecord({
      id: "booth-1",
      agency_id: "agency-1",
      event_id: "event-1",
      name: "Sponsor Booth",
      sort_order: 1,
      status: "ready",
    });

    const model = buildVenueReadModel({
      eventId: "event-1",
      attendees: [attendee],
      sessions: [session],
      expoBooths: [booth],
      replayCount: 1,
    });

    expect(model.attendees[0].networkingOptIn).toBe(true);
    expect(model.sessions[0].title).toBe("Opening");
    expect(model.expoBooths[0].name).toBe("Sponsor Booth");
    expect(model.replayCount).toBe(1);
  });
});
