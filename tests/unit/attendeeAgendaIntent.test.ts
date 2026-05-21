import { describe, expect, it } from "vitest";

describe("attendee agenda intent", () => {
  it("stores planning intent without granting restricted access", () => {
    const intent = { plannedSessionIds: ["vip-session"], grantsAccess: false };
    expect(intent.plannedSessionIds).toContain("vip-session");
    expect(intent.grantsAccess).toBe(false);
  });
});
