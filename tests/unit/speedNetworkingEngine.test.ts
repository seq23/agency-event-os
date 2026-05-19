import { describe, expect, it } from "vitest";
import {
  buildSpeedNetworkingProducerSummary,
  canMatchEntries,
  endSpeedNetworkingMatch,
  selectNextSpeedNetworkingPair,
} from "@/services/speed-networking";
import type { SpeedNetworkingEntry, SpeedNetworkingMatch } from "@/types/speedNetworkingEngine";

const entries: SpeedNetworkingEntry[] = [
  {
    id: "entry-a",
    agencyId: "agency-1",
    eventId: "event-1",
    queueId: "queue-1",
    displayName: "A",
    status: "waiting",
    joinedQueueAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "entry-b",
    agencyId: "agency-1",
    eventId: "event-1",
    queueId: "queue-1",
    displayName: "B",
    status: "waiting",
    joinedQueueAt: "2026-01-01T00:00:00.000Z",
  },
];

describe("speed networking engine", () => {
  it("selects eligible pairs and prevents duplicates", () => {
    expect(canMatchEntries({ first: entries[0], second: entries[1] })).toBe(true);
    expect(canMatchEntries({ first: entries[0], second: entries[1], recentPairs: [["entry-a", "entry-b"]] })).toBe(false);
    expect(selectNextSpeedNetworkingPair(entries)?.map((entry) => entry.id)).toEqual(["entry-a", "entry-b"]);
  });

  it("ends matches and summarizes queue state", () => {
    const match: SpeedNetworkingMatch = {
      id: "match-1",
      agencyId: "agency-1",
      eventId: "event-1",
      queueId: "queue-1",
      participantAEntryId: "entry-a",
      participantBEntryId: "entry-b",
      status: "active",
      startsAt: "2026-01-01T00:00:00.000Z",
      expiresAt: "2026-01-01T00:03:00.000Z",
    };

    expect(endSpeedNetworkingMatch(match, "expired").status).toBe("expired");

    const summary = buildSpeedNetworkingProducerSummary({
      eventId: "event-1",
      queueId: "queue-1",
      entries,
      matches: [match],
      reportCount: 1,
    });

    expect(summary.waitingCount).toBe(2);
    expect(summary.activeMatchCount).toBe(1);
    expect(summary.reportCount).toBe(1);
  });
});
