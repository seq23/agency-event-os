import { describe, expect, it } from "vitest";
import { buildCsvExport, buildEventReport, buildSponsorReport, buildTestingIncidentReport } from "@/services/reports";

describe("reports and exports", () => {
  it("builds event and sponsor reports", () => {
    const report = buildEventReport({
      id: "report-1",
      agencyId: "agency-1",
      eventId: "event-1",
      reportType: "client_event",
      title: "Client report",
      metrics: {
        attendees: 100,
        sessions: 4,
        checkIns: 92,
      },
    });

    const sponsorReport = buildSponsorReport({
      agencyId: "agency-1",
      eventId: "event-1",
      sponsorId: "sponsor-1",
      sponsorName: "Acme",
      boothVisits: 55,
      leads: 12,
      ctaClicks: 8,
    });

    expect(report.sections).toHaveLength(3);
    expect(sponsorReport.title).toContain("Acme");
  });

  it("builds testing incident report and csv exports", () => {
    const testingReport = buildTestingIncidentReport({
      agencyId: "agency-1",
      eventId: "event-1",
      incidentCount: 2,
      testingFailureCount: 1,
    });

    const csv = buildCsvExport({
      fileName: "leads.csv",
      rows: [
        { name: "Ava", company: "A Co", note: "Hello, sponsor" },
        { name: "Ben", company: "B Co", note: "Needs follow-up" },
      ],
    });

    expect(testingReport.reportType).toBe("testing_incident");
    expect(csv.body).toContain('"Hello, sponsor"');
    expect(csv.contentType).toBe("text/csv");
  });
});
