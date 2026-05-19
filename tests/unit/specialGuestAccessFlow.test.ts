import { describe, expect, it } from "vitest";
import { canSpecialGuestAccessPath } from "@/lib/auth/v5RouteAuthorization";

describe("special guest role isolation", () => {
  const speaker = { kind: "special_guest" as const, eventId: "event-summit", role: "speaker" as const, issuedAt: Date.now(), expiresAt: Date.now() + 10000 };
  it("allows the correct role route", () => {
    expect(canSpecialGuestAccessPath("/speaker/events/event-summit", speaker)).toBe(true);
  });
  it("denies the wrong role route", () => {
    expect(canSpecialGuestAccessPath("/sponsor/events/event-summit", speaker)).toBe(false);
  });
  it("denies event-id lookalikes", () => {
    expect(canSpecialGuestAccessPath("/speaker/events/event-summit-extra", speaker)).toBe(false);
  });
});
