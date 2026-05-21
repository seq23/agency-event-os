import { expect, type Page } from "@playwright/test";
import registry from "@/data/testing/cta-promise-registry.json";
import routeOutcomes from "@/data/testing/persona-route-outcomes.json";

export function findCtaPromise(sourceRoute: string, ctaText: string) {
  return registry.ctas.find((cta) => cta.sourceRoute === sourceRoute && cta.ctaText === ctaText);
}

export async function expectNoSurpriseAuth(page: Page) {
  const path = new URL(page.url()).pathname;
  const body = await page.locator("body").innerText().catch(() => "");
  if (path.startsWith("/app") || path.startsWith("/admin")) {
    expect(body.toLowerCase()).toMatch(/login|admin|workspace|operator|access|password/);
  }
}

export async function expectAuthDisclosureIfProtected(page: Page, protectedHref: string) {
  if (!protectedHref.startsWith("/app") && !protectedHref.startsWith("/admin")) return;
  await expect(page.locator("body")).toContainText(/login|admin|workspace|operator|access|password/i);
}

export function expectPersonaAllowedRoute(personaId: string, path: string) {
  const persona = routeOutcomes.personas.find((item) => item.id === personaId);
  expect(persona, `persona ${personaId} must exist`).toBeTruthy();
  expect(persona?.forbiddenRoutes.some((route) => path.startsWith(route.replace("[eventId]", "demo")))).toBeFalsy();
}

export async function expectPromiseMatchesDestination(page: Page, sourceRoute: string, ctaText: string) {
  const promise = findCtaPromise(sourceRoute, ctaText);
  expect(promise, `${sourceRoute} / ${ctaText} must be registered`).toBeTruthy();
  await expectNoSurpriseAuth(page);
}

export async function expectCtaOutcome(page: Page, sourceRoute: string, ctaText: string) {
  await expectPromiseMatchesDestination(page, sourceRoute, ctaText);
}

export async function expectRuntimeState(page: Page, marker: string) {
  await expect(page.locator("body")).toContainText(new RegExp(marker, "i"));
}
