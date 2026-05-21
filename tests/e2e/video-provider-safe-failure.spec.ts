import { expect, test } from "@playwright/test";

test("video token routes fail safely when provider secrets are absent", async ({ request }) => {
  const payload = {
    eventId: "event-summit",
    roomId: "event-summit-main-stage",
    roomType: "main_stage",
    displayName: "E2E Attendee",
    role: "attendee",
  };
  const livekit = await request.post("/api/video/livekit-token", { data: payload });
  expect([200, 400, 403, 409, 500, 502]).toContain(livekit.status());
  const livekitBody = await livekit.text();
  expect(livekitBody).not.toContain("__next_error__");
  expect(livekitBody).not.toContain("Internal Server Error");

  const daily = await request.post("/api/video/daily-token", { data: payload });
  expect([200, 400, 403, 409, 500, 502]).toContain(daily.status());
  const dailyBody = await daily.text();
  expect(dailyBody).not.toContain("__next_error__");
  expect(dailyBody).not.toContain("Internal Server Error");
});
