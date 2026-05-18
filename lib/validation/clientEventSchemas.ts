import { z } from "zod";

const slugSchema = z
  .string()
  .min(2, "Slug must be at least 2 characters.")
  .max(80, "Slug must be under 80 characters.")
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must use lowercase letters, numbers, and hyphens.");

export const clientInputSchema = z.object({
  agencyId: z.string().uuid(),
  name: z.string().min(2).max(120),
  slug: slugSchema,
  industry: z.string().max(120).optional().or(z.literal("")),
  websiteUrl: z.string().url().optional().or(z.literal("")),
  logoUrl: z.string().url().optional().or(z.literal("")),
  primaryContactName: z.string().max(120).optional().or(z.literal("")),
  primaryContactEmail: z.string().email().optional().or(z.literal("")),
  status: z.enum(["active", "prospect", "paused", "archived"]).default("active"),
  internalNotes: z.string().max(2000).optional().or(z.literal("")),
});

export const eventInputSchema = z.object({
  agencyId: z.string().uuid(),
  clientId: z.string().uuid(),
  name: z.string().min(2).max(160),
  slug: slugSchema,
  eventType: z.enum([
    "virtual_summit",
    "webinar",
    "demo_day",
    "sponsor_expo",
    "paid_workshop",
    "executive_roundtable",
    "community_event",
    "course_launch",
    "internal_town_hall",
    "hybrid_support",
  ]),
  status: z.enum(["draft", "published", "registration_open", "pre_event", "live", "ended", "replay_available", "archived"]).default("draft"),
  startAt: z.string().datetime().optional().or(z.literal("")),
  endAt: z.string().datetime().optional().or(z.literal("")),
  timezone: z.string().min(1).default("America/Chicago"),
  description: z.string().max(3000).optional().or(z.literal("")),
  internalGoal: z.string().max(2000).optional().or(z.literal("")),
  clientFacingGoal: z.string().max(2000).optional().or(z.literal("")),
  primaryProducerUserId: z.string().uuid().optional().or(z.literal("")),
  projectManagerUserId: z.string().uuid().optional().or(z.literal("")),
  registrationEnabled: z.coerce.boolean().default(false),
  venueEnabled: z.coerce.boolean().default(true),
  replayEnabled: z.coerce.boolean().default(true),
  reportingEnabled: z.coerce.boolean().default(true),
});

export type ClientInput = z.input<typeof clientInputSchema>;
export type EventInput = z.input<typeof eventInputSchema>;

export function normalizeOptional(value?: string | null) {
  return value && value.trim().length > 0 ? value.trim() : null;
}
