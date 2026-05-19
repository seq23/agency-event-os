import { describe, expect, it } from "vitest";
import { canCrewAccessPath, canPerformCrewAction } from "@/lib/auth/v5RouteAuthorization";

describe("crew access flow", () => {
  it("allows broad crew access only when no event scope is set", () => {
    const payload = { kind: "crew" as const, role: "crew" as const, issuedAt: Date.now(), expiresAt: Date.now() + 10000 };
    expect(canCrewAccessPath("/app/events/event-summit", payload)).toBe(true);
  });
  it("enforces scoped crew event IDs", () => {
    const payload = { kind: "crew" as const, eventId: "event-summit", role: "crew" as const, issuedAt: Date.now(), expiresAt: Date.now() + 10000 };
    expect(canCrewAccessPath("/app/events/event-summit", payload)).toBe(true);
    expect(canCrewAccessPath("/app/events/event-summit-extra", payload)).toBe(false);
  });
  it("requires explicit role capability for fallback switching", () => {
    const support = { kind: "crew" as const, eventId: "event-summit", role: "support" as const, issuedAt: Date.now(), expiresAt: Date.now() + 10000 };
    const td = { kind: "crew" as const, eventId: "event-summit", role: "technical_director" as const, issuedAt: Date.now(), expiresAt: Date.now() + 10000 };
    expect(canPerformCrewAction(support, "switch_video_fallback", "event-summit")).toBe(false);
    expect(canPerformCrewAction(td, "switch_video_fallback", "event-summit")).toBe(true);
  });
});
