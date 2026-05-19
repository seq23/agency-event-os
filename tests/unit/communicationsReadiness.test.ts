import { describe, expect, it } from "vitest";
import { getEventCommunicationReadiness } from "@/services/communications/eventCommunicationService";

describe("communications readiness", () => {
  it("exposes configured lifecycle templates", () => {
    const readiness = getEventCommunicationReadiness("event-summit");
    expect(readiness.templates.map((item) => item.templateKey)).toEqual(expect.arrayContaining(["attendee_confirmation", "speaker_invite", "sponsor_invite", "post_event_report"]));
  });
});
