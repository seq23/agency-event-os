import type { EventReport, EventReportMetric, EventReportSection, EventReportType } from "@/types/reports";

function section(sectionKey: string, title: string, summary: string, metrics: EventReportMetric[], sortOrder: number): EventReportSection {
  return {
    sectionKey,
    title,
    summary,
    metrics,
    sortOrder,
  };
}

export function buildEventReport(input: {
  id: string;
  agencyId: string;
  clientId?: string;
  eventId: string;
  reportType: EventReportType;
  title: string;
  metrics: {
    attendees?: number;
    sessions?: number;
    checkIns?: number;
    leads?: number;
    incidents?: number;
    testingFailures?: number;
    sponsorBooths?: number;
    questions?: number;
    polls?: number;
  };
}): EventReport {
  const sections: EventReportSection[] = [
    section(
      "overview",
      "Event overview",
      "High-level operating results for the event.",
      [
        { label: "Attendees", value: input.metrics.attendees ?? 0 },
        { label: "Sessions", value: input.metrics.sessions ?? 0 },
        { label: "Check-ins", value: input.metrics.checkIns ?? 0 },
      ],
      1,
    ),
    section(
      "engagement",
      "Engagement",
      "Audience participation and sponsor engagement foundation metrics.",
      [
        { label: "Questions", value: input.metrics.questions ?? 0 },
        { label: "Polls", value: input.metrics.polls ?? 0 },
        { label: "Sponsor booths", value: input.metrics.sponsorBooths ?? 0 },
      ],
      2,
    ),
    section(
      "operations",
      "Operations",
      "Production and diagnostic issue summary.",
      [
        { label: "Incidents", value: input.metrics.incidents ?? 0 },
        { label: "Testing failures", value: input.metrics.testingFailures ?? 0 },
      ],
      3,
    ),
  ];

  return {
    id: input.id,
    agencyId: input.agencyId,
    clientId: input.clientId,
    eventId: input.eventId,
    reportType: input.reportType,
    title: input.title,
    status: "generated",
    sections,
  };
}

export function buildSponsorReport(input: {
  agencyId: string;
  eventId: string;
  sponsorId: string;
  sponsorName: string;
  boothVisits: number;
  leads: number;
  ctaClicks: number;
}): EventReport {
  return buildEventReport({
    id: `sponsor-report-${input.sponsorId}`,
    agencyId: input.agencyId,
    eventId: input.eventId,
    reportType: "sponsor",
    title: `${input.sponsorName} sponsor report`,
    metrics: {
      sponsorBooths: 1,
      leads: input.leads,
      attendees: input.boothVisits,
      questions: input.ctaClicks,
    },
  });
}

export function buildTestingIncidentReport(input: {
  agencyId: string;
  eventId: string;
  incidentCount: number;
  testingFailureCount: number;
}): EventReport {
  return buildEventReport({
    id: `testing-report-${input.eventId}`,
    agencyId: input.agencyId,
    eventId: input.eventId,
    reportType: "testing_incident",
    title: "Testing incident report",
    metrics: {
      incidents: input.incidentCount,
      testingFailures: input.testingFailureCount,
    },
  });
}
