import { expect, type Page } from "@playwright/test";

const forbiddenBodyTerms = [
  "Internal Server Error",
  "Application error",
  "__next_error__",
  "This page could not be found",
  "NEXT_REDIRECT",
];

const forbiddenBodyPatterns = [
  /digest\s*[:=]\s*["']?[a-z0-9_-]{6,}/i,
  /\bserver error digest\b/i,
];

export async function assertNoAppError(page: Page) {
  await page.waitForLoadState("domcontentloaded");
  const body = await page.locator("body").innerText({ timeout: 10_000 });
  for (const term of forbiddenBodyTerms) {
    expect(body, `page body must not contain ${term}`).not.toContain(term);
  }
  for (const pattern of forbiddenBodyPatterns) {
    expect(body, `page body must not match ${pattern}`).not.toMatch(pattern);
  }
}

export async function gotoAndAssert(page: Page, path: string) {
  const response = await page.goto(path, { waitUntil: "domcontentloaded" });
  expect(response, `${path} must return an HTTP response`).not.toBeNull();
  expect(response!.status(), `${path} must not 500`).toBeLessThan(500);
  await assertNoAppError(page);
}
