"use client";

import { useEffect, useMemo } from "react";
import type { V4AnalyticsEvent } from "@/types/v4";

interface AnalyticsBeaconProps {
  eventId: string;
  kind: V4AnalyticsEvent["kind"];
  subjectId?: string;
  metadata?: Record<string, string | number | boolean>;
}

export function AnalyticsBeacon({ eventId, kind, subjectId, metadata }: AnalyticsBeaconProps) {
  const requestBody = useMemo(() => JSON.stringify({ eventId, kind, subjectId, metadata }), [eventId, kind, subjectId, metadata]);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: requestBody,
      signal: controller.signal,
    }).catch(() => undefined);
    return () => controller.abort();
  }, [requestBody]);

  return null;
}
