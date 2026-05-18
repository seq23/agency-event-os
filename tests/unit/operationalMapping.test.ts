import { describe, expect, it } from "vitest";
import { mapApprovalRequestRecord, mapLastMinuteChangeRecord, mapProductionInboxRecord } from "@/services/persistence/mapOperationalRecords";

describe("operational persistence mapping", () => {
  it("maps approval requests to approval queue items", () => {
    const item = mapApprovalRequestRecord({ id: "ap", agency_id: "ag", client_id: "cl", event_id: "ev", approval_type: "speaker_script", title: "Script", status: "needs_agency_review", resource_type: "speaker_script", resource_id: "res", client_visible: true, locked: false });
    expect(item.blockingScope).toBe("speaker");
    expect(item.clientApprovalRequired).toBe(true);
  });
  it("maps production inbox items", () => {
    const item = mapProductionInboxRecord({ id: "in", agency_id: "ag", client_id: "cl", event_id: "ev", event_code: "NOVA", source_channel: "email_attachment", status: "needs_matching", sender_name: "Speaker", sender_email: "s@example.com", subject: "Deck", received_at: "2026-01-01T00:00:00Z" });
    expect(item.sourceChannel).toBe("email_attachment");
    expect(item.nextAction).toContain("Review");
  });
  it("maps last-minute change records", () => {
    const change = mapLastMinuteChangeRecord({ id: "chg", agency_id: "ag", client_id: "cl", event_id: "ev", change_type: "deck_replacement", urgency: "within_60_minutes", risk: "high", status: "producer_review", title: "Deck v3", affects_timing: true, affects_sponsor_mention: false, affects_client_approved_copy: true, minutes_until_segment: 18, submitted_at: "2026-01-01T00:00:00Z" });
    expect(change.risk).toBe("high");
    expect(change.affectsClientApprovedCopy).toBe(true);
  });
});
