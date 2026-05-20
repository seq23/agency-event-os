import { expect, test } from "@playwright/test";
import { gotoAndAssert } from "./helpers/assertNoAppError";

test("production access surfaces load with explicit access forms", async ({ page }) => {
  await gotoAndAssert(page, "/production-access");
  await expect(page.getByText(/production access/i).first()).toBeVisible();

  await gotoAndAssert(page, "/production-access/crew");
  await expect(page.locator("body")).toContainText(/crew/i);

  await gotoAndAssert(page, "/production-access/special-guest");
  await expect(page.locator("body")).toContainText(/guest|speaker|sponsor|vip/i);
});
