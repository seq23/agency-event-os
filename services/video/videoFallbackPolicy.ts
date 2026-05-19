import { isDailyFallbackEnabled } from "@/lib/env";
import type { AppEnv } from "@/lib/env";

export type VideoFallbackProviderKey = "livekit" | "daily" | "zoom_sdk" | "google_meet";

export interface VideoFallbackPolicy {
  primary: VideoFallbackProviderKey;
  order: VideoFallbackProviderKey[];
  dailyAutomaticFallbackEnabled: boolean;
  producerPermissionRequiredForDaily: boolean;
  producerPermissionRequiredForManagedFallback: boolean;
}

export function getVideoFallbackPolicy(env?: Partial<AppEnv>): VideoFallbackPolicy {
  const dailyEnabled = env ? isDailyFallbackEnabled(env) : isDailyFallbackEnabled();
  const order: VideoFallbackProviderKey[] = dailyEnabled
    ? ["livekit", "daily", "zoom_sdk", "google_meet"]
    : ["livekit", "zoom_sdk", "google_meet"];

  return {
    primary: "livekit",
    order,
    dailyAutomaticFallbackEnabled: dailyEnabled,
    producerPermissionRequiredForDaily: false,
    producerPermissionRequiredForManagedFallback: true,
  };
}

export function getNextVideoFallbackProvider(failedProvider: VideoFallbackProviderKey, env?: Partial<AppEnv>) {
  const policy = getVideoFallbackPolicy(env);
  const index = policy.order.indexOf(failedProvider);
  return index >= 0 ? policy.order[index + 1] : undefined;
}
