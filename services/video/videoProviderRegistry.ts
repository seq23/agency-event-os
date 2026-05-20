import type { VideoProvider } from "./VideoProvider";
import { MockVideoProvider } from "./MockVideoProvider";
import { createLiveKitProviderFromEnv } from "./LiveKitVideoProvider";
import { createDailyProviderFromEnv } from "./DailyVideoProvider";

const providers = new Map<string, VideoProvider>();

export function registerVideoProvider(provider: VideoProvider) {
  providers.set(provider.key, provider);
}

function isProductionRuntime() {
  return process.env.NODE_ENV === "production" && process.env.NEXT_PHASE !== "phase-production-build" && process.env.npm_lifecycle_event !== "build";
}

export function getVideoProvider(key = process.env.VIDEO_PROVIDER || (isProductionRuntime() ? "livekit" : "mock")): VideoProvider {
  if (isProductionRuntime() && key === "mock" && process.env.ALLOW_MOCK_VIDEO_PROVIDER_IN_PRODUCTION !== "true") {
    throw new Error("VIDEO_PROVIDER=mock is not allowed in production runtime unless ALLOW_MOCK_VIDEO_PROVIDER_IN_PRODUCTION=true is explicitly set.");
  }
  const provider = providers.get(key);
  if (!provider) {
    throw new Error(`Video provider not registered: ${key}`);
  }
  return provider;
}

export function listVideoProviders() {
  return Array.from(providers.keys());
}

registerVideoProvider(new MockVideoProvider());

const liveKitProvider = createLiveKitProviderFromEnv();
if (liveKitProvider) {
  registerVideoProvider(liveKitProvider);
}


const dailyProvider = createDailyProviderFromEnv();
if (dailyProvider) {
  registerVideoProvider(dailyProvider);
}
