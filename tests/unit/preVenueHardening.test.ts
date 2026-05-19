import { describe, expect, it } from "vitest";
import { buildDashboardCrudCards } from "@/services/dashboard/dashboardCrudService";
import { applyAssetReviewAction } from "@/services/assets/assetReviewService";
import { mapAuditToActivityFeedItem } from "@/services/audit/activityFeedService";
import { buildEventReport } from "@/services/reports";
import { mapReportToCenterItem } from "@/services/reports/reportCenterService";

describe("pre-venue hardening", () => {
  it("builds dashboard cards and report center items", () => {
    const cards = buildDashboardCrudCards({ clientCount: 1, eventCount: 2, assetCount: 3, reportCount: 1, openProductionItemCount: 0 });
    expect(cards).toHaveLength(5);
    expect(cards[0].status).toBe("ready");

    const report = buildEventReport({ id: "report-1", agencyId: "agency-1", eventId: "event-1", reportType: "client_event", title: "Report", metrics: {} });
    expect(mapReportToCenterItem(report).status).toBe("ready");
  });

  it("applies asset review and maps audit feed", () => {
    const reviewed = applyAssetReviewAction({
      id: "asset-1",
      agencyId: "agency-1",
      assetType: "speaker_deck",
      sourceChannel: "portal_upload",
      bucketName: "speaker-assets",
      storagePath: "a/b.pdf",
      fileName: "deck.pdf",
      fileSizeBytes: 100,
      mimeType: "application/pdf",
      versionNumber: 1,
      status: "uploaded",
      reviewStatus: "needs_review",
      isLocked: false,
      isLiveVersion: false,
      uploadedAt: "2026-01-01T00:00:00.000Z",
    }, "made_live");

    expect(reviewed.isLiveVersion).toBe(true);

    const activity = mapAuditToActivityFeedItem({
      id: "audit-1",
      agencyId: "agency-1",
      actorUserId: "user-1",
      actorRole: "producer",
      action: "asset_uploaded",
      resourceType: "asset",
      resourceId: "asset-1",
      visibility: "internal_agency",
      createdAt: "2026-01-01T00:00:00.000Z",
    });

    expect(activity.title).toBe("asset uploaded");
  });
});
