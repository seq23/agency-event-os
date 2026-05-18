export type ReadinessCategoryKey =
  | "event_setup"
  | "client_approvals"
  | "run_of_show"
  | "speakers"
  | "sponsors"
  | "contractors"
  | "vendors"
  | "assets"
  | "venue_configuration"
  | "rehearsal"
  | "reporting";

export type ReadinessCategoryStatus = "blocked" | "at_risk" | "needs_attention" | "ready";

export interface ReadinessCategory {
  key: ReadinessCategoryKey;
  label: string;
  score: number;
  status: ReadinessCategoryStatus;
  missingItems: string[];
  recommendedActions: string[];
}

export interface EventReadiness {
  eventId: string;
  overallScore: number;
  status: ReadinessCategoryStatus;
  categories: ReadinessCategory[];
}
