import { expect, test } from "@playwright/test";
import { gotoAndAssert } from "./helpers/assertNoAppError";
import { requiredDay1Default } from "./helpers/day1AccessDefaults";

const forbidden = /Supabase Auth required|admin account required|login\?next=|not authorized|forbidden|missing setup|unknown event|Application error|Internal Server Error/i;

test("operator can create a phony event and understand the setup journey", async ({ page }) => {
  await gotoAndAssert(page, "/production-access/operator");

  await page.getByLabel(/operator launchpad password/i).fill(process.env.E2E_OPERATOR_PASSWORD || requiredDay1Default("OPERATOR_LAUNCHPAD_PASSWORD"));
  await page.getByRole("button", { name: /enter operator launchpad/i }).click();

  await expect(page).toHaveURL(/\/production-access\/launchpad/);
  await expect(page.locator("body")).toContainText(/Operator Launchpad/i);
  await expect(page.getByRole("link", { name: /Create Event in Admin Workspace/i }).first()).toBeVisible();

  await page.getByRole("link", { name: /Create Event in Admin Workspace/i }).first().click();

  await expect(page).toHaveURL(/\/app\/events\/new/);
  await expect(page.getByRole("heading", { name: /Start a guided event setup/i })).toBeVisible();
  await expect(page.locator("body")).toContainText(/creates a real local\/runtime event setup draft/i);
  await expect(page.locator("body")).toContainText(/Basics.*Branding.*Attendee Flow.*Venue.*Agenda.*Access.*Communications.*Preview.*Publish/i);

  await page.getByLabel(/^Event name/i).fill("Playwright Operator Preview Event");
  await page.getByLabel(/Event code \/ slug/i).fill("playwright-operator-preview");
  await page.getByLabel(/Client or organizer name/i).fill("West Peek Productions");
  await page.getByLabel(/Event date/i).fill("2026-06-15");
  await page.getByLabel(/Primary audience/i).fill("Operators, attendees, speakers, sponsors, VIPs");
  await page.getByLabel(/Event type/i).fill("Virtual summit");
  await page.getByLabel(/Primary video provider/i).fill("LiveKit");
  await page.getByLabel(/Fallback video provider/i).fill("Daily, then Zoom + Google Meet");

  await page.getByRole("button", { name: /Create setup draft and continue/i }).click();

  await expect(page).toHaveURL(/\/app\/events\/event-summit\/setup\?draftId=draft-playwright-operator-preview-/);
  const body = page.locator("body");

  await expect(body).toContainText(/Setup.*Basics|Event basics/i);
  await expect(page.getByTestId("event-setup-draft-summary")).toBeVisible();
  await expect(body).toContainText("Playwright Operator Preview Event");
  await expect(body).toContainText("West Peek Productions");
  await expect(body).toContainText("playwright-operator-preview");
  await expect(body).toContainText("2026-06-15");
  await expect(body).toContainText("Operators, attendees, speakers, sponsors, VIPs");
  await expect(body).toContainText("Virtual summit");
  await expect(body).toContainText(/LiveKit.*Daily, then Zoom \+ Google Meet/i);

  await expect(page.getByRole("link", { name: /Preview event/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Open run of show/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Back to operator launchpad/i })).toBeVisible();
  await expect(body).not.toContainText(forbidden);
});
