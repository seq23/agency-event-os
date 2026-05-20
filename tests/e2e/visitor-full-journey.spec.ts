import { expect, test } from "@playwright/test";
import { expectLinksStayFirstParty, expectRouteMatrix, expectVisibleRoute } from "./helpers/roleJourney";

test("visitor can discover, evaluate, register, and reach safe first-party entry points", async ({ page }) => {
  await expectRouteMatrix(page, [
    { path: "/", label: "home", terms: ["west peek"], anyOf: ["production", "event", "virtual"] },
    { path: "/join", label: "join", terms: ["west peek"], anyOf: ["join", "access", "event"] },
    { path: "/production-access", label: "production access", terms: ["production", "access"], anyOf: ["crew", "guest", "setup"] },
    { path: "/events/demo", label: "public event", terms: ["nova", "summit"], anyOf: ["register", "venue", "agenda"] },
    { path: "/events/demo/agenda", label: "public agenda", anyOf: ["agenda", "session", "founder"] },
    { path: "/events/demo/register", label: "registration", terms: ["registration"], anyOf: ["name", "email", "company"] },
    { path: "/events/demo/speakers", label: "speakers", anyOf: ["speaker", "drake"] },
    { path: "/events/demo/sponsors", label: "sponsors", anyOf: ["sponsor", "clarity"] },
    { path: "/submit/NOVA-2026-SUMMIT/speaker", label: "speaker submission", anyOf: ["speaker", "submit", "upload"] },
    { path: "/submit/NOVA-2026-SUMMIT/sponsor", label: "sponsor submission", anyOf: ["sponsor", "submit", "booth"] },
  ]);

  await page.goto("/");
  await expectLinksStayFirstParty(page);
  await expect(page.getByRole("link").first()).toBeVisible();
});

test("visitor registration form exposes all rich profile fields without writing production data", async ({ page }) => {
  await expectVisibleRoute(page, { path: "/events/demo/register", label: "registration", terms: ["registration"] });
  for (const field of ["name", "email", "company", "title", "personalWebsite", "socialLinks", "reasonForAttending", "interestingFact"]) {
    await expect(page.locator(`[name="${field}"]`), `${field} should be present`).toBeVisible();
  }
  await expect(page.getByRole("button", { name: /submit registration/i })).toBeVisible();
});
