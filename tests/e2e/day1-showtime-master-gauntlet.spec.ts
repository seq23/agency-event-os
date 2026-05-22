import { expect, test, type BrowserContext, type Page } from "@playwright/test";
import { gotoAndAssert } from "./helpers/assertNoAppError";

test.setTimeout(300_000);

const forbidden = /Application error|Internal Server Error|__next_error__|digest|unknown event|missing setup|Supabase Auth required|admin account required|not authorized|forbidden|operator required|special guest password|TODO|placeholder|lorem ipsum|coming soon|undefined|null|\[object Object\]/i;

async function assertUsefulPage(page: Page, expected: RegExp) {
  const body = page.locator("body");
  await expect(body).toContainText(expected);
  await expect(body).not.toContainText(forbidden);
}

async function isolatedPage(context: BrowserContext) {
  return context.newPage();
}

async function loginOperator(page: Page) {
  await gotoAndAssert(page, "/production-access/operator");
  await page.getByLabel(/operator launchpad password/i).fill(process.env.E2E_OPERATOR_PASSWORD || process.env.OPERATOR_LAUNCHPAD_PASSWORD || "OperatorLaunchpad-2026!");
  await page.getByRole("button", { name: /enter operator launchpad/i }).click();
  await expect(page).toHaveURL(/\/production-access\/launchpad/);
  await assertUsefulPage(page, /Operator Launchpad/i);
}

async function loginOwner(page: Page) {
  await gotoAndAssert(page, "/production-access/owner");
  await page.getByLabel(/owner master password/i).fill(process.env.E2E_OWNER_PASSWORD || process.env.OWNER_MASTER_ACCESS_PASSWORD || "OwnerMaster-2026!");
  await page.getByRole("button", { name: /enter owner workspace/i }).click();
  await expect(page).toHaveURL(/\/app/);
  await assertUsefulPage(page, /Dashboard|Agency|Events|West Peek|Event/i);
}

async function loginCrew(page: Page) {
  await gotoAndAssert(page, "/production-access/crew");
  await page.getByLabel(/crew password/i).fill(process.env.E2E_CREW_PASSWORD || process.env.CREW_ACCESS_PASSWORD || "CrewAccess-2026!");
  await page.getByLabel(/event code/i).fill("demo");
  await page.getByLabel(/production role/i).selectOption("crew");
  await page.getByRole("button", { name: /enter crew workspace/i }).click();
  await expect(page).toHaveURL(/\/crew\/events\/(demo|event-summit)/);
  await assertUsefulPage(page, /Crew show-day command|Crew Briefing/i);
}

async function loginSpecialGuest(page: Page, role: "client" | "speaker" | "sponsor" | "crew_lite" | "vip", envKey: string, expectedUrl: RegExp, expectedText: RegExp) {
  const code = process.env[envKey];
  expect(code, `${envKey} must be present for special guest gauntlet`).toBeTruthy();

  await gotoAndAssert(page, "/production-access/special-guest");
  await page.getByLabel(/event code/i).fill("demo");
  await page.getByLabel(/special guest password/i).fill(code || "");
  await page.getByRole("button", { name: /continue to assigned portal/i }).click();

  await expect(page, role).toHaveURL(expectedUrl);
  await assertUsefulPage(page, expectedText);
}

async function assertCannotAccess(page: Page, route: string, expectedGate: RegExp) {
  await gotoAndAssert(page, route);
  await expect(page).toHaveURL(expectedGate);
  await expect(page.locator("body")).not.toContainText(/Application error|Internal Server Error|__next_error__|digest/i);
}

test("Day 1 showtime master gauntlet proves role journeys, transactions, outcomes, and boundaries", async ({ browser }) => {
  const attendeeContext = await browser.newContext();
  const attendee = await isolatedPage(attendeeContext);

  await gotoAndAssert(attendee, "/");
  await assertUsefulPage(attendee, /Join an Event|West Peek Live|Plan an Event/i);

  await gotoAndAssert(attendee, "/events/demo");
  await assertUsefulPage(attendee, /Register|Preview venue|Agenda preview|Speakers|Sponsors/i);

  await attendee.getByRole("link", { name: /register/i }).first().click();
  await expect(attendee).toHaveURL(/\/events\/demo\/register/);
  await assertUsefulPage(attendee, /Registration|attendee identity|does not grant speaker, sponsor, client, crew, operator, admin, VIP/i);

  await attendee.getByLabel(/^Name/i).fill("Playwright Attendee");
  await attendee.getByLabel(/^Email/i).fill("playwright-attendee@example.com");
  await attendee.getByLabel(/Company \/ affiliation/i).fill("West Peek QA");
  await attendee.getByLabel(/Title \/ role/i).fill("Hostile Client Reviewer");
  await attendee.getByLabel(/What brings you to the conference/i).fill("Testing the full Day 1 venue journey.");
  await attendee.getByLabel(/Networking goals/i).fill("Find useful people without hitting a registration wall.");
  await attendee.getByRole("button", { name: /submit registration/i }).click();

  await expect(attendee).toHaveURL(/\/venue\/(demo|event-summit)\/lobby/);
  await assertUsefulPage(attendee, /Lobby|Attendee venue|West Peek/i);
  await attendee.reload();
  await assertUsefulPage(attendee, /Lobby|Attendee venue|West Peek/i);

  for (const route of [
    "/venue/demo/lobby",
    "/venue/demo/stage",
    "/venue/demo/sessions",
    "/venue/demo/breakouts",
    "/venue/demo/networking",
    "/venue/demo/expo",
    "/venue/demo/people",
    "/venue/demo/replay",
    "/venue/demo/help",
  ]) {
    await gotoAndAssert(attendee, route);
    await assertUsefulPage(attendee, /West Peek|Attendee venue|Lobby|Stage|Sessions|Networking|Expo|People|Replay|Help|Breakouts/i);
  }

  await assertCannotAccess(attendee, "/production-access/launchpad", /\/production-access\/operator/);
  await assertCannotAccess(attendee, "/app/events/new", /\/production-access\/operator/);
  await assertCannotAccess(attendee, "/crew/events/event-summit", /\/production-access\/crew/);
  await assertCannotAccess(attendee, "/speaker/events/event-summit", /\/production-access\/special-guest/);
  await assertCannotAccess(attendee, "/sponsor/events/event-summit", /\/production-access\/special-guest/);
  await assertCannotAccess(attendee, "/client/client/events/event-summit", /\/production-access\/special-guest/);
  await attendeeContext.close();

  const ownerContext = await browser.newContext();
  const owner = await isolatedPage(ownerContext);
  await loginOwner(owner);
  for (const route of ["/app", "/app/settings", "/app/events", "/app/events/new", "/billing", "/admin/testing", "/admin/testing/event-summit"]) {
    await gotoAndAssert(owner, route);
    await expect(owner.locator("body")).not.toContainText(forbidden);
  }
  await ownerContext.close();

  const operatorContext = await browser.newContext();
  const operator = await isolatedPage(operatorContext);
  await loginOperator(operator);

  const launchpad = operator.locator("body");
  await expect(launchpad).toContainText(/Create Event in Admin Workspace/i);
  await expect(launchpad).toContainText(/Preview Demo Venue/i);
  await expect(launchpad).toContainText(/Crew Briefing & Instructions/i);
  await expect(launchpad).toContainText(/Run of Show/i);
  await expect(launchpad).toContainText(/Video Health/i);
  await expect(launchpad).toContainText(/Crew Gate|Test Crew Login/i);
  await expect(launchpad).not.toContainText(/Coming soon|TODO|placeholder|lorem ipsum/i);

  await operator.getByRole("link", { name: /Create Event in Admin Workspace/i }).first().click();
  await expect(operator).toHaveURL(/\/app\/events\/new/);
  await assertUsefulPage(operator, /Start a guided event setup/i);
  await expect(operator.locator("body")).toContainText(/Basics.*Branding.*Attendee Flow.*Venue.*Agenda.*Access.*Communications.*Preview.*Publish/i);

  await operator.getByLabel(/^Event name/i).fill("Playwright Day 1 Showtime Master Event");
  await operator.getByLabel(/Event code \/ slug/i).fill("playwright-day1-showtime-master");
  await operator.getByLabel(/Client or organizer name/i).fill("West Peek Productions");
  await operator.getByLabel(/Event date/i).fill("2026-06-15");
  await operator.getByLabel(/Primary audience/i).fill("Operators, attendees, speakers, sponsors, VIPs");
  await operator.getByLabel(/Event type/i).fill("Virtual summit");
  await operator.getByLabel(/Primary video provider/i).fill("LiveKit");
  await operator.getByLabel(/Fallback video provider/i).fill("Daily, then Zoom + Google Meet");
  await operator.getByRole("button", { name: /Create setup draft and continue/i }).click();

  await expect(operator).toHaveURL(/\/app\/events\/event-summit\/setup\?draftId=draft-playwright-day1-showtime-master-/);
  await expect(operator.getByTestId("event-setup-draft-summary")).toBeVisible();
  await expect(operator.locator("body")).toContainText("Playwright Day 1 Showtime Master Event");
  await expect(operator.locator("body")).toContainText(/LiveKit.*Daily, then Zoom \+ Google Meet/i);
  const setupUrl = operator.url();

  await operator.getByRole("link", { name: /Preview event/i }).click();
  await expect(operator).toHaveURL(/\/venue\/(demo|event-summit)\/lobby/);
  await assertUsefulPage(operator, /Lobby|Attendee venue|West Peek/i);

  await operator.goto(setupUrl);
  await operator.getByRole("link", { name: /Open run of show/i }).click();
  await expect(operator).toHaveURL(/\/run-of-show/);
  await assertUsefulPage(operator, /Run of Show|Agenda|Stage/i);

  await operator.goto(setupUrl);
  await operator.getByRole("link", { name: /Back to operator launchpad/i }).click();
  await expect(operator).toHaveURL(/\/production-access\/launchpad/);
  await assertUsefulPage(operator, /Operator Launchpad/i);

  await operator.getByRole("link", { name: /Crew Briefing & Instructions/i }).first().click();
  await expect(operator).toHaveURL(/\/app\/events\/event-summit\/crew/);
  await assertUsefulPage(operator, /Publish crew instructions for show day|Crew Briefing/i);
  await expect(operator.locator("body")).toContainText(/call sheet|run of show|task list|fallback|escalation/i);

  for (const route of ["/app/events/event-summit/video-health", "/app/events/event-summit/run-of-show", "/app/events/event-summit/preview"]) {
    await gotoAndAssert(operator, route);
    await expect(operator.locator("body")).not.toContainText(forbidden);
  }

  await assertCannotAccess(operator, "/app/settings", /\/production-access\/owner/);
  await assertCannotAccess(operator, "/billing", /\/production-access\/owner/);
  await operatorContext.close();

  const crewContext = await browser.newContext();
  const crew = await isolatedPage(crewContext);
  await loginCrew(crew);
  for (const route of [
    "/crew/events/event-summit",
    "/crew/events/event-summit/call-sheet",
    "/crew/events/event-summit/run-of-show",
    "/crew/events/event-summit/tasks",
  ]) {
    await gotoAndAssert(crew, route);
    await assertUsefulPage(crew, /Crew|Call Sheet|Run of Show|Tasks|Escalation/i);
  }
  await assertCannotAccess(crew, "/production-access/launchpad", /\/production-access\/operator/);
  await assertCannotAccess(crew, "/app/events/new", /\/production-access\/operator/);
  await assertCannotAccess(crew, "/app/settings", /\/production-access\/owner/);
  await crewContext.close();

  const roleCases = [
    {
      role: "speaker",
      env: "EVENT_DEMO_SPEAKER_CODE",
      url: /\/speaker\/events\/event-summit/,
      text: /Speaker portal|onboarding checklist|bio|headshot|deck|tech check/i,
      denied: ["/sponsor/events/event-summit", "/client/client/events/event-summit", "/app/events/new", "/crew/events/event-summit"],
    },
    {
      role: "sponsor",
      env: "EVENT_DEMO_SPONSOR_CODE",
      url: /\/sponsor\/events\/event-summit/,
      text: /Sponsor portal|Booth setup|lead report|Logo|CTA|Lead routing/i,
      denied: ["/speaker/events/event-summit", "/client/client/events/event-summit", "/app/events/new", "/crew/events/event-summit"],
    },
    {
      role: "client",
      env: "EVENT_DEMO_CLIENT_CODE",
      url: /\/client\/[^/]+\/events\/event-summit/,
      text: /Client portal|event progress|approvals|assets|reports|Your events/i,
      denied: ["/speaker/events/event-summit", "/sponsor/events/event-summit", "/app/events/new", "/crew/events/event-summit"],
    },
    {
      role: "vip",
      env: "EVENT_DEMO_VIP_CODE",
      url: /\/venue\/event-summit\/lobby/,
      text: /Lobby|Attendee venue|West Peek/i,
      denied: ["/speaker/events/event-summit", "/sponsor/events/event-summit", "/client/client/events/event-summit", "/app/events/new", "/crew/events/event-summit"],
    },
    {
      role: "crew_lite",
      env: "EVENT_DEMO_CREW_LITE_CODE",
      url: /\/crew\/events\/event-summit/,
      text: /Crew show-day command|Crew Briefing/i,
      denied: ["/speaker/events/event-summit", "/sponsor/events/event-summit", "/client/client/events/event-summit", "/app/events/new", "/production-access/launchpad"],
    },
  ] as const;

  for (const roleCase of roleCases) {
    const context = await browser.newContext();
    const page = await isolatedPage(context);
    await loginSpecialGuest(page, roleCase.role, roleCase.env, roleCase.url, roleCase.text);

    for (const deniedRoute of roleCase.denied) {
      const expectedGate = deniedRoute.startsWith("/app") || deniedRoute === "/production-access/launchpad"
        ? /\/production-access\/operator/
        : deniedRoute.startsWith("/crew")
          ? /\/production-access\/crew/
          : /\/production-access\/special-guest/;
      await assertCannotAccess(page, deniedRoute, expectedGate);
    }

    await assertCannotAccess(page, "/app/settings", /\/production-access\/owner/);
    await assertCannotAccess(page, "/billing", /\/production-access\/owner/);
    await context.close();
  }
});
