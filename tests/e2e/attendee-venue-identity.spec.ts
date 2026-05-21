import { test, expect } from "@playwright/test";

test("venue identity powers main-stage, breakout, networking, help, people, and My Agenda / my-agenda surfaces", async ({ page }) => {
  await page.goto("/venue/demo/stage");
  await expect(page.locator("body")).not.toContainText("current-attendee");
  await expect(page.locator("body")).not.toContainText("Conference Attendee");
  await expect(page.locator("body")).toContainText(/Register to request|Posting as|My Agenda|my-agenda/i);

  await page.goto("/venue/demo/breakouts");
  await expect(page.locator("body")).toContainText(/breakout|chat|Register/i);
  await expect(page.locator("body")).not.toContainText("current-attendee");

  await page.goto("/venue/demo/networking");
  await expect(page.locator("body")).toContainText(/networking queue|Register for this event/i);
  await expect(page.locator("body")).not.toContainText("Local E2E Attendee");

  await page.goto("/venue/demo/help");
  await expect(page.locator("body")).toContainText(/attendee profile|Ask for help/i);

  await page.goto("/venue/demo/people");
  await expect(page.locator("body")).toContainText(/People|Networking/i);
});
