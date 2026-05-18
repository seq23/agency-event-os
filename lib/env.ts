import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),

  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional().or(z.literal("")),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional().or(z.literal("")),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional().or(z.literal("")),

  AUTH_SESSION_COOKIE_NAME: z.string().min(1).default("agency_event_os_session"),

  RESEND_API_KEY: z.string().optional().or(z.literal("")),
  EMAIL_FROM: z.string().email().optional().or(z.literal("")),

  VIDEO_PROVIDER: z.enum(["mock", "livekit", "daily", "agora", "mux", "twilio", "other"]).default("mock"),
});

export type AppEnv = z.infer<typeof envSchema>;

export function getEnv(): AppEnv {
  return envSchema.parse({
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
    AUTH_SESSION_COOKIE_NAME: process.env.AUTH_SESSION_COOKIE_NAME || "agency_event_os_session",
    RESEND_API_KEY: process.env.RESEND_API_KEY || "",
    EMAIL_FROM: process.env.EMAIL_FROM || "",
    VIDEO_PROVIDER: process.env.VIDEO_PROVIDER || "mock",
  });
}

export function isSupabaseConfigured(env: AppEnv = getEnv()) {
  return Boolean(env.NEXT_PUBLIC_SUPABASE_URL && env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export function isSupabaseAdminConfigured(env: AppEnv = getEnv()) {
  return Boolean(env.NEXT_PUBLIC_SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY);
}

export function isResendConfigured(env: AppEnv = getEnv()) {
  return Boolean(env.RESEND_API_KEY && env.EMAIL_FROM);
}

export function getAuthCookieName(env: AppEnv = getEnv()) {
  return env.AUTH_SESSION_COOKIE_NAME;
}
