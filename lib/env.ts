import { z } from "zod";

const emailIdentitySchema = z.string().min(3).refine((value) => {
  if (!value) return true;
  return /^[^<\n]+<[^@\s<>]+@[^@\s<>]+\.[^@\s<>]+>$/.test(value.trim()) || /^[^@\s<>]+@[^@\s<>]+\.[^@\s<>]+$/.test(value.trim());
}, "EMAIL_FROM must be either email@example.com or Name <email@example.com>");

const isProduction = process.env.NODE_ENV === "production";
const isProductionBuild = process.env.NEXT_PHASE === "phase-production-build" || process.env.npm_lifecycle_event === "build";
const devOnlyCookieSecret = "dev-only-cookie-secret-change-before-deploy";
const devOnlyCrewPassword = "dev-only-crew-password-change-before-deploy";

function requiredInProduction(name: string, value: string | undefined, fallback: string) {
  if (value) return value;
  if (isProduction && !isProductionBuild) throw new Error(`${name} is required in production.`);
  return fallback;
}

const envSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),

  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional().or(z.literal("")),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional().or(z.literal("")),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional().or(z.literal("")),

  AUTH_SESSION_COOKIE_NAME: z.string().min(1).default("agency_event_os_session"),
  V5_ACCESS_COOKIE_SECRET: z.string().min(32),
  V5_CREW_COOKIE_NAME: z.string().min(1).default("wpl_crew_access"),
  V5_SPECIAL_GUEST_COOKIE_NAME: z.string().min(1).default("wpl_guest_access"),
  CREW_ACCESS_PASSWORD: z.string().min(12),

  RESEND_API_KEY: z.string().optional().or(z.literal("")),
  EMAIL_FROM: emailIdentitySchema.optional().or(z.literal("")),
  EMAIL_REPLY_TO: z.string().email().optional().or(z.literal("")),

  VIDEO_PROVIDER: z.enum(["mock", "livekit", "daily", "agora", "mux", "twilio", "other"]).default("mock"),

  DAILY_API_KEY: z.string().optional().or(z.literal("")),
  DAILY_API_BASE_URL: z.string().url().default("https://api.daily.co/v1"),
  DAILY_DOMAIN: z.string().optional().or(z.literal("")),
  DAILY_FALLBACK_ENABLED: z.enum(["true", "false"]).default("false"),
});

export type AppEnv = z.infer<typeof envSchema>;

export function getEnv(): AppEnv {
  const videoProvider = process.env.VIDEO_PROVIDER || (isProduction ? "livekit" : "mock");
  return envSchema.parse({
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
    AUTH_SESSION_COOKIE_NAME: process.env.AUTH_SESSION_COOKIE_NAME || "agency_event_os_session",
    V5_ACCESS_COOKIE_SECRET: requiredInProduction("V5_ACCESS_COOKIE_SECRET", process.env.V5_ACCESS_COOKIE_SECRET || process.env.V4_ACCESS_COOKIE_SECRET, devOnlyCookieSecret),
    V5_CREW_COOKIE_NAME: process.env.V5_CREW_COOKIE_NAME || process.env.V4_CREW_COOKIE_NAME || "wpl_crew_access",
    V5_SPECIAL_GUEST_COOKIE_NAME: process.env.V5_SPECIAL_GUEST_COOKIE_NAME || process.env.V4_SPECIAL_GUEST_COOKIE_NAME || "wpl_guest_access",
    CREW_ACCESS_PASSWORD: requiredInProduction("CREW_ACCESS_PASSWORD", process.env.CREW_ACCESS_PASSWORD, devOnlyCrewPassword),
    RESEND_API_KEY: process.env.RESEND_API_KEY || "",
    EMAIL_FROM: process.env.EMAIL_FROM || "",
    EMAIL_REPLY_TO: process.env.EMAIL_REPLY_TO || "",
    VIDEO_PROVIDER: videoProvider,
    DAILY_API_KEY: process.env.DAILY_API_KEY || "",
    DAILY_API_BASE_URL: process.env.DAILY_API_BASE_URL || "https://api.daily.co/v1",
    DAILY_DOMAIN: process.env.DAILY_DOMAIN || "",
    DAILY_FALLBACK_ENABLED: process.env.DAILY_FALLBACK_ENABLED === "true" ? "true" : "false",
  });
}

export function isSupabaseConfigured(env: Partial<AppEnv> = getEnv()) {
  return Boolean(env.NEXT_PUBLIC_SUPABASE_URL && env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export function isSupabaseAdminConfigured(env: Partial<AppEnv> = getEnv()) {
  return Boolean(env.NEXT_PUBLIC_SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY);
}

export function isResendConfigured(env: Partial<AppEnv> = getEnv()) {
  return Boolean(env.RESEND_API_KEY && env.EMAIL_FROM);
}

export function getEmailReplyTo(env: Partial<AppEnv> = getEnv()) {
  return env.EMAIL_REPLY_TO || undefined;
}

export function getAuthCookieName(env: Partial<AppEnv> = getEnv()) {
  return env.AUTH_SESSION_COOKIE_NAME || "agency_event_os_session";
}

export function getLiveKitEnv() {
  return {
    livekitUrl: process.env.LIVEKIT_URL,
    livekitApiKey: process.env.LIVEKIT_API_KEY,
    livekitApiSecret: process.env.LIVEKIT_API_SECRET,
  };
}

export function hasLiveKitEnv() {
  const env = getLiveKitEnv();
  return Boolean(env.livekitUrl && env.livekitApiKey && env.livekitApiSecret);
}

export function getDailyEnv(env: Partial<AppEnv> = getEnv()) {
  return {
    dailyApiKey: env.DAILY_API_KEY || "",
    dailyApiBaseUrl: env.DAILY_API_BASE_URL || "https://api.daily.co/v1",
    dailyDomain: env.DAILY_DOMAIN || "",
    dailyFallbackEnabled: env.DAILY_FALLBACK_ENABLED === "true",
  };
}

export function isDailyConfigured(env: Partial<AppEnv> = getEnv()) {
  const daily = getDailyEnv(env);
  return Boolean(daily.dailyApiKey && daily.dailyApiBaseUrl && daily.dailyDomain);
}

export function isDailyFallbackEnabled(env: Partial<AppEnv> = getEnv()) {
  return env.DAILY_FALLBACK_ENABLED === "true" && isDailyConfigured(env);
}

export function getV4AccessCookieNames(env: AppEnv = getEnv()) {
  return getV5AccessCookieNames(env);
}

export function getV5AccessCookieNames(env: AppEnv = getEnv()) {
  return {
    crewCookieName: env.V5_CREW_COOKIE_NAME,
    specialGuestCookieName: env.V5_SPECIAL_GUEST_COOKIE_NAME,
  };
}

export function getCrewAccessPassword(env: AppEnv = getEnv()) {
  return env.CREW_ACCESS_PASSWORD;
}

export function getV5AccessCookieSecret(env: AppEnv = getEnv()) {
  return env.V5_ACCESS_COOKIE_SECRET;
}
