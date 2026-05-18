import { describe, expect, it } from "vitest";
import { buildSpeakerGreenRoomReadModel, mapSpeakerRecord, mapSpeakerScriptRecord } from "@/services/speakers";
import { buildSponsorReadyRoomReadModel, mapSponsorPackageRecord, mapSponsorRecord } from "@/services/sponsors";

describe("speaker and sponsor persistence mapping", () => {
  it("maps speaker records and scripts", () => {
    const speaker = mapSpeakerRecord({
      id: "speaker-1",
      agency_id: "agency-1",
      client_id: "client-1",
      event_id: "event-1",
      display_name: "Jane Speaker",
      email: "jane@example.com",
      title: "Founder",
      organization: "Example Co",
      readiness_status: "ready_for_live",
      tech_check_status: "passed",
    });

    const script = mapSpeakerScriptRecord({
      id: "script-1",
      speaker_id: "speaker-1",
      event_id: "event-1",
      version_number: 1,
      title: "Approved script",
      script_text: "Hello",
      talking_points: ["Open", "Close"],
      status: "approved",
      submitted_at: "2026-01-01T00:00:00.000Z",
      is_live_version: true,
      rollback_available: true,
    });

    const model = buildSpeakerGreenRoomReadModel({ speaker, approvedScript: script });

    expect(model.speakerName).toBe("Jane Speaker");
    expect(model.approvedScriptVersion?.isLiveVersion).toBe(true);
  });

  it("maps sponsor records and packages", () => {
    const sponsor = mapSponsorRecord({
      id: "sponsor-1",
      agency_id: "agency-1",
      client_id: "client-1",
      event_id: "event-1",
      name: "Acme Sponsor",
      booth_status: "approved",
      ready_room_status: "ready",
    });

    const sponsorPackage = mapSponsorPackageRecord({
      id: "package-1",
      agency_id: "agency-1",
      client_id: "client-1",
      event_id: "event-1",
      sponsor_id: "sponsor-1",
      tier_key: "gold",
      tier_name: "Gold Sponsor",
      price_cents: 500000,
      status: "approved",
      booth_enabled: true,
      session_enabled: true,
      ros_mentions_allowed: 2,
      lead_access_level: "qualified_leads",
      reporting_level: "premium",
    });

    const model = buildSponsorReadyRoomReadModel({ sponsor });

    expect(model.sponsorName).toBe("Acme Sponsor");
    expect(sponsorPackage.price).toBe(5000);
  });
});
