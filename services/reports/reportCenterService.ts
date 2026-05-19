import type { EventReport } from "@/types/reports";
import type { ReportCenterItem } from "@/types/preVenueHardening";

export function mapReportToCenterItem(report: EventReport): ReportCenterItem {
  return {
    id: `report-center-${report.id}`,
    agencyId: report.agencyId,
    clientId: report.clientId,
    eventId: report.eventId,
    reportId: report.id,
    label: report.title,
    reportType: report.reportType,
    status: report.status === "published" ? "published" : "ready",
    lastGeneratedAt: new Date().toISOString(),
  };
}

export function groupReportsByStatus(items: ReportCenterItem[]) {
  return items.reduce<Record<ReportCenterItem["status"], ReportCenterItem[]>>(
    (acc, item) => {
      acc[item.status].push(item);
      return acc;
    },
    { draft: [], ready: [], published: [], needs_update: [] },
  );
}
