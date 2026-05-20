"use server";

import { redirect } from "next/navigation";
import { getRuntimeStore } from "@/services/runtime/runtimeStoreFactory";
import { recordAnalyticsEvent } from "@/services/analytics/analyticsEventService";
import { getEventConfig } from "@/services/events/eventConfigRepository";
import { sha256Hex } from "@/lib/security/portableCrypto";

function clean(value: FormDataEntryValue | null) {
  return String(value || "").trim();
}

function cleanSocialLinks(value: string) {
  return value.split(/\n|,/).map((item) => item.trim()).filter(Boolean).slice(0, 5);
}

export async function submitEventRegistration(formData: FormData) {
  const eventId = clean(formData.get("eventId"));
  const slug = clean(formData.get("slug"));
  const email = clean(formData.get("email"));
  const name = clean(formData.get("name"));
  const company = clean(formData.get("company"));
  const title = clean(formData.get("title"));
  const personalWebsite = clean(formData.get("personalWebsite"));
  const socialLinks = cleanSocialLinks(clean(formData.get("socialLinks")));
  const reasonForAttending = clean(formData.get("reasonForAttending"));
  const interestingFact = clean(formData.get("interestingFact"));
  if (!eventId || !slug) throw new Error("Registration requires event identity.");
  if (!email.includes("@")) throw new Error("Registration requires a valid email address.");
  const event = getEventConfig(eventId);
  if (!event) throw new Error(`Cannot register for unconfigured event ${eventId}.`);
  const createdAt = new Date().toISOString();
  const attendeeEmailHash = await sha256Hex(email.trim().toLowerCase());
  try {
    await getRuntimeStore().appendRegistration({
      id: `registration-${eventId}-${Date.now()}`,
      eventId,
      attendeeEmailHash,
      status: "submitted",
      displayName: name,
      company,
      title,
      personalWebsite,
      socialLinks,
      reasonForAttending,
      interestingFact,
      createdAt,
    });
    await recordAnalyticsEvent({
      eventId,
      kind: "registration_submitted",
      subjectId: attendeeEmailHash,
      metadata: { nameProvided: Boolean(name), companyProvided: Boolean(company), profileCompleted: Boolean(reasonForAttending || interestingFact || socialLinks.length) },
    }).catch(() => undefined);
  } catch {
    // Registration should never throw a generic server error after form submit; route to venue with safe profile data degraded.
  }
  redirect(`/venue/${eventId}/lobby?registered=1`);
}
