export type EventReportType =
  | "client_event"
  | "sponsor"
  | "attendance"
  | "engagement"
  | "testing_incident"
  | "lead_export";

export type EventReportStatus = "draft" | "generated" | "published" | "archived";

export interface EventReportMetric {
  label: string;
  value: string | number;
  description?: string;
}

export interface EventReportSection {
  sectionKey: string;
  title: string;
  summary: string;
  metrics: EventReportMetric[];
  sortOrder: number;
}

export interface EventReport {
  id: string;
  agencyId: string;
  clientId?: string;
  eventId: string;
  reportType: EventReportType;
  title: string;
  status: EventReportStatus;
  sections: EventReportSection[];
}

export interface CsvExport {
  fileName: string;
  contentType: "text/csv";
  body: string;
}
