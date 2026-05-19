import { NextResponse } from "next/server";
import { recordAnalyticsEvent } from "@/services/analytics/analyticsEventService";
import type { V4AnalyticsEvent } from "@/types/v4";

const allowedKinds: V4AnalyticsEvent["kind"][] = [
  "attendee_joined_lobby",
  "attendee_joined_session",
  "attendee_visited_sponsor_booth",
  "sponsor_cta_clicked",
  "support_requested",
  "replay_watched",
  "networking_joined",
  "registration_submitted",
  "question_asked",
];

export async function POST(request: Request) {
  const body = await request.json().catch(() => undefined) as Partial<V4AnalyticsEvent> | undefined;
  if (!body?.eventId || !body.kind || !allowedKinds.includes(body.kind)) {
    return NextResponse.json({ ok: false, error: "Invalid analytics event." }, { status: 400 });
  }
  const event = await recordAnalyticsEvent({
    eventId: body.eventId,
    kind: body.kind,
    subjectId: body.subjectId,
    metadata: body.metadata,
  });
  return NextResponse.json({ ok: true, id: event.id });
}
