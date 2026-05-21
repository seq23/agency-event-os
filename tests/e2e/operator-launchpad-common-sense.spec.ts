import { expect, test, type Page } from "@playwright/test";
import { gotoAndAssert } from "./helpers/assertNoAppError";

const forbidden = /Application error|Internal Server Error|not authorized|forbidden|missing setup|unknown event|Supabase Auth required|admin account required/i;

async function loginOperator(page: Page) {
  await gotoAndAssert(page, "/production-access/operator");
  await page.getByLabel(/operator launchpad password/i).fill(process.env.E2E_OPERATOR_PASSWORD || "OperatorLaunchpad-2026!");
  await page.getByRole("button", { name: /enter operator launchpad/i }).click();
  await expect(page).toHaveURL(/\/production-access\/launchpad/);
}

test("operator launchpad exposes useful Day 1 actions without obvious dead-end language", async ({ page }) => {
  await loginOperator(page);

  const body = page.locator("body");
  await expect(body).toContainText(/Operator Launchpad/i);
  await expect(body).toContainText(/Create Event in Admin Workspace/i);
  await expect(body).toContainText(/Preview Demo Venue/i);
  await expect(body).toContainText(/Open Operator Packet|Day 1 Operator Packet/i);
  await expect(body).toContainText(/Run of Show/i);
  await expect(body).toContainText(/Video Health/i);
  await expect(body).toContainText(/Crew Gate|Test Crew Login/i);
  await expect(body).not.toContainText(forbidden);
});

test("operator preview venue button opens the seeded phony venue without app errors", async ({ page }) => {
  await loginOperator(page);

  await page.getByRole("link", { name: /Preview Demo Venue/i }).first().click();
  await expect(page).toHaveURL(/\/venue\/demo\/lobby/);
  await expect(page.locator("body")).toContainText(/Lobby|Attendee venue|West Peek/i);
  await expect(page.locator("body")).not.toContainText(forbidden);

  await page.getByRole("link", { name: /Networking/i }).first().click();
  await expect(page).toHaveURL(/\/venue\/(demo|event-summit)\/networking/);
  await expect(page.locator("body")).toContainText(/Networking/i);
  await expect(page.locator("body")).not.toContainText(/Application error|Internal Server Error|unknown event|forbidden|not authorized/i);
});
