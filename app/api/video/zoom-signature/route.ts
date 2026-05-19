import { NextResponse } from "next/server";
import { generateZoomMeetingSdkSignature } from "@/services/video/zoomMeetingSdkAuth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const meetingNumber = String(body.meetingNumber ?? "").replace(/\s/g, "");
    const role = Number(body.role ?? 0) === 1 ? 1 : 0;

    if (!meetingNumber || !/^\d{9,12}$/.test(meetingNumber)) {
      return NextResponse.json({ error: "A valid room number is required." }, { status: 400 });
    }

    const signature = generateZoomMeetingSdkSignature({ meetingNumber, role });

    return NextResponse.json(signature);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Zoom embedded room could not be prepared.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
