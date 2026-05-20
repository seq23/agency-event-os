import { expect, test } from "@playwright/test";
import { gotoAndAssert } from "./helpers/assertNoAppError";

test("demo venue can reach core attendee surfaces", async ({ page }) => {
  for (const route of [
    "/venue/demo/lobby",
    "/venue/event-summit/lobby",
    "/venue/event-summit/stage",
    "/venue/event-summit/networking",
    "/venue/event-summit/expo",
  ]) {
    await gotoAndAssert(page, route);
    await expect(page.locator("body")).not.toBeEmpty();
  }
});
