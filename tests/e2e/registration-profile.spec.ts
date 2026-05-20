import { expect, test } from "@playwright/test";
import { gotoAndAssert } from "./helpers/assertNoAppError";

test("registration captures rich attendee profile fields", async ({ page }) => {
  await gotoAndAssert(page, "/events/nova-summit/register");
  for (const field of [
    "name",
    "email",
    "company",
    "title",
    "personalWebsite",
    "socialLinks",
    "reasonForAttending",
    "interestingFact",
  ]) {
    await expect(page.locator(`[name=\"${field}\"]`)).toBeVisible();
  }
});
