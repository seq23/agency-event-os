import { describe, expect, it } from "vitest";
import { getSetupCompletion } from "@/services/events/eventSetupCompletionService";

describe("event setup completion", () => {
  it("contains all named v4 setup sections", () => {
    const completion = getSetupCompletion("event-summit");
    expect(completion.sections.map((section) => section.key)).toEqual(expect.arrayContaining(["branding", "attendee-flow", "venue", "agenda", "access", "communications", "preview"]));
  });
});
