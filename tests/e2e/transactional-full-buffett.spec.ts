import { expect, test } from "@playwright/test";
import { createPairHistoryRecord, normalizedSpeedNetworkingPairKey, selectNextSpeedNetworkingPair } from "@/services/speed-networking";
import type { SpeedNetworkingEntry, SpeedNetworkingMatch, SpeedNetworkingPairHistory } from "@/types/speedNetworkingEngine";
import { gotoAndAssert } from "./helpers/assertNoAppError";
import { grantAgencySession, grantCrewAccess } from "./helpers/roleJourney";
import { expectEventuallyDraft, expectEventuallyRuntime, readRuntimeSnapshot, resetRuntimeTraceFiles } from "./helpers/runtimeTrace";

const unique = Date.now();

test.describe.serial("Transactional Full Buffett E2E", () => {
  test.beforeEach(() => {
    resetRuntimeTraceFiles();
  });

  test("producer creates a local setup draft, records a run-of-show action, and opens show-readiness cockpit", async ({ page }) => {
    await grantAgencySession(page);
    await gotoAndAssert(page, "/app/events/new");

    const eventName = `Transactional Buffett Summit ${unique}`;
    await page.locator('[name="eventName"]').fill(eventName);
    await page.locator('[name="eventCode"]').fill(`transactional-buffett-${unique}`);
    await page.locator('[name="clientName"]').fill("West Peek Productions QA");
    await page.locator('[name="eventDate"]').fill("2026-06-15");
    await page.locator('[name="audience"]').fill("Operators, speakers, sponsors, VIPs");
    await page.locator('[name="eventType"]').fill("Virtual summit");
    await page.locator('[name="primaryVideo"]').fill("LiveKit");
    await page.locator('[name="fallbackVideo"]').fill("Daily, then Zoom + Google Meet");
    await page.getByRole("button", { name: /create setup draft and continue/i }).click();
    await expect(page).toHaveURL(/\/app\/events\/event-summit\/setup\?draftId=/);

    await expectEventuallyDraft((drafts) => drafts.some((draft) => draft.eventName === eventName && draft.primaryVideo === "LiveKit"), "event setup draft should persist to local runtime");

    await gotoAndAssert(page, "/app/events/demo/run-of-show");
    await page.getByRole("button", { name: /^Mark live$/i }).click();
    await expectEventuallyRuntime(
      (snapshot) => (snapshot.runOfShowEvents || []).some((event: any) => event.eventId === "event-summit" && event.action === "mark_live"),
      "producer run-of-show action should persist",
    );

    await grantCrewAccess(page, "producer");
    await gotoAndAssert(page, "/admin/testing/demo");
    const body = (await page.locator("body").innerText()).toLowerCase();
    for (const term of ["showtime readiness", "livestream", "livekit", "matchmaking", "fallback", "zoom", "google meet", "debug", "fix"]) {
      expect(body).toContain(term);
    }
    await expect(page.getByTestId("showtime-readiness-barometer")).toBeVisible();
    await expect(page.getByTestId("fallback-decision-helper")).toBeVisible();
  });

  test("visitor registration writes a rich local profile, attendee surfaces emit analytics, and help creates support state", async ({ page }) => {
    await gotoAndAssert(page, "/events/demo/register");
    const attendeeName = `Buffett Attendee ${unique}`;
    await page.locator('[name="name"]').fill(attendeeName);
    await page.locator('[name="email"]').fill(`buffett-${unique}@example.com`);
    await page.locator('[name="company"]').fill("West Peek QA Ventures");
    await page.locator('[name="title"]').fill("Show Readiness Operator");
    await page.locator('[name="personalWebsite"]').fill("https://westpeek.live");
    await page.locator('[name="socialLinks"]').fill("https://linkedin.com/in/westpeekqa");
    await page.locator('[name="reasonForAttending"]').fill("Validate the event venue transactionally before deployment.");
    await page.locator('[name="interestingFact"]').fill("I test the system like a producer on show day.");
    await page.getByRole("button", { name: /submit registration/i }).click();
    await expect(page).toHaveURL(/\/venue\/event-summit\/lobby\?registered=1/);

    await expectEventuallyRuntime(
      (snapshot) => (snapshot.registrations || []).some((registration: any) => registration.displayName === attendeeName && registration.company === "West Peek QA Ventures"),
      "registration should persist rich attendee profile",
    );

    await gotoAndAssert(page, "/venue/event-summit/stage");
    await expectEventuallyRuntime(
      (snapshot) => (snapshot.analyticsEvents || []).some((event: any) => event.kind === "attendee_joined_session" && event.eventId === "event-summit"),
      "stage visit should record attendee session analytics",
    );

    await gotoAndAssert(page, "/venue/event-summit/help");
    await page.locator('[name="subject"]').fill(`Transactional support request ${unique}`);
    await page.locator('[name="message"]').fill("Need help validating fallback rooms before showtime.");
    await page.getByRole("button", { name: /send help request/i }).click();
    await expectEventuallyRuntime(
      (snapshot) => (snapshot.supportRequests || []).some((request: any) => String(request.subject).includes(`Transactional support request ${unique}`)),
      "help request should persist support state",
    );
  });

  test("attendee networking join writes queue analytics and matching engine proves match/no-repeat/exhaustion semantics", async ({ page }) => {
    await gotoAndAssert(page, "/venue/event-summit/networking");
    await page.getByRole("button", { name: /join queue/i }).click();
    await expect(page).toHaveURL(/\/venue\/event-summit\/networking\?state=waiting&queued=1/);
    await expectEventuallyRuntime(
      (snapshot) => (snapshot.analyticsEvents || []).some((event: any) => event.kind === "networking_joined" && event.metadata?.queueState === "waiting"),
      "networking join should record queue analytics",
    );

    const entries: SpeedNetworkingEntry[] = [
      { id: "entry-a", attendeeId: "attendee-a", agencyId: "agency-1", eventId: "event-summit", queueId: "queue-1", displayName: "A", status: "waiting", joinedQueueAt: "2026-01-01T00:00:00.000Z" },
      { id: "entry-b", attendeeId: "attendee-b", agencyId: "agency-1", eventId: "event-summit", queueId: "queue-1", displayName: "B", status: "waiting", joinedQueueAt: "2026-01-01T00:01:00.000Z" },
      { id: "entry-c", attendeeId: "attendee-c", agencyId: "agency-1", eventId: "event-summit", queueId: "queue-1", displayName: "C", status: "waiting", joinedQueueAt: "2026-01-01T00:02:00.000Z" },
    ];
    const firstPair = selectNextSpeedNetworkingPair(entries);
    expect(firstPair?.map((entry) => entry.attendeeId)).toEqual(["attendee-a", "attendee-b"]);

    const match: SpeedNetworkingMatch = {
      id: "match-ab",
      agencyId: "agency-1",
      eventId: "event-summit",
      queueId: "queue-1",
      participantAEntryId: "entry-a",
      participantBEntryId: "entry-b",
      normalizedPairKey: normalizedSpeedNetworkingPairKey("event-summit", entries[0], entries[1]),
      status: "active",
      startsAt: "2026-01-01T00:00:00.000Z",
      expiresAt: "2026-01-01T00:03:00.000Z",
    };
    const history: SpeedNetworkingPairHistory[] = [createPairHistoryRecord(match, entries[0], entries[1])];
    const secondPair = selectNextSpeedNetworkingPair(entries, [], history);
    expect(secondPair?.map((entry) => entry.attendeeId)).toEqual(["attendee-a", "attendee-c"]);

    const exhausted: SpeedNetworkingPairHistory[] = [
      ...history,
      { eventId: "event-summit", normalizedPairKey: normalizedSpeedNetworkingPairKey("event-summit", entries[0], entries[2]), attendeeAId: "attendee-a", attendeeBId: "attendee-c", firstMatchedAt: "2026-01-01T00:03:00.000Z", matchId: "match-ac" },
      { eventId: "event-summit", normalizedPairKey: normalizedSpeedNetworkingPairKey("event-summit", entries[1], entries[2]), attendeeAId: "attendee-b", attendeeBId: "attendee-c", firstMatchedAt: "2026-01-01T00:06:00.000Z", matchId: "match-bc" },
    ];
    expect(selectNextSpeedNetworkingPair(entries, [], exhausted)).toBeNull();
  });

  test("video provider token endpoints fail safely without secrets and preserve operator fallback decisioning", async ({ request, page }) => {
    const payload = {
      eventId: "event-summit",
      roomId: "event-summit-main-stage",
      roomType: "main_stage",
      displayName: "Transactional Video Tester",
      role: "producer",
    };
    for (const route of ["/api/video/livekit-token", "/api/video/daily-token", "/api/video/zoom-signature"]) {
      const response = await request.post(route, { data: payload });
      expect(response.status(), `${route} should fail safely or succeed with provider-shaped response`).toBeLessThan(503);
      const text = await response.text();
      expect(text).not.toContain("Internal Server Error");
      expect(text).not.toContain("__next_error__");
      expect(text).not.toMatch(/digest\s*[:=]/i);
    }

    await grantCrewAccess(page, "producer");
    await gotoAndAssert(page, "/admin/testing/demo");
    const body = (await page.locator("body").innerText()).toLowerCase();
    expect(body).toContain("livekit");
    expect(body).toContain("daily");
    expect(body).toContain("zoom");
    expect(body).toContain("google meet");
    expect(body).toContain("switch");
  });
});
