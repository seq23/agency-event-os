import { NextResponse } from "next/server";
import { requireOperatorAccessForRequest } from "@/lib/auth/operatorRequestGuard";
import { applyStageStreamSignal } from "@/services/video/stageStreamStateService";
import { toPublicStageStreamState, type StageStreamSignal } from "@/types/stageStream";

export async function POST(request: Request) {
  const operator = await requireOperatorAccessForRequest();
  if (!operator.ok) return NextResponse.json({ ok: false, error: operator.error }, { status: 401 });
  const body = await request.json().catch(() => ({})) as { eventId?: string; stageId?: string; signal?: StageStreamSignal; reason?: string };
  if (!body.eventId) return NextResponse.json({ ok: false, error: "eventId is required." }, { status: 400 });
  const state = await applyStageStreamSignal({ eventId: body.eventId, stageId: body.stageId || "main-stage", signal: body.signal || "manual_switch_to_daily", reason: body.reason || "Fallback API requested." });
  return NextResponse.json({ ok: true, state: toPublicStageStreamState(state) });
}
