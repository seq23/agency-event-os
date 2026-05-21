import { NextResponse } from "next/server";
import { requireOperatorAccessForRequest } from "@/lib/auth/operatorRequestGuard";
import { provisionStreamYardLiveKitIngress } from "@/services/video/livekitIngressService";

export async function POST(request: Request) {
  const operator = await requireOperatorAccessForRequest();
  if (!operator.ok) return NextResponse.json({ ok: false, error: operator.error }, { status: 401 });
  const body = await request.json().catch(() => ({})) as { eventId?: string; stageId?: string };
  if (!body.eventId) return NextResponse.json({ ok: false, error: "eventId is required." }, { status: 400 });
  const result = await provisionStreamYardLiveKitIngress({ eventId: body.eventId, stageId: body.stageId || "main-stage", actorRole: "operator" });
  return NextResponse.json({ ok: result.ok, result }, { status: result.ok ? 200 : 409 });
}
