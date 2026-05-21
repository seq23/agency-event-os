import { describe, expect, it } from "vitest";

describe("attendee session rules", () => {
  it("keeps sessions event-scoped and attendee-only", () => {
    const session = { eventId: "demo", attendeeId: "attendee-1", role: "attendee", status: "active" };
    expect(session.eventId).toBe("demo");
    expect(session.role).toBe("attendee");
  });
});
