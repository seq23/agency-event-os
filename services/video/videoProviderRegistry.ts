import type { VideoProvider } from "./VideoProvider";
import { MockVideoProvider } from "./MockVideoProvider";
import { createLiveKitProviderFromEnv } from "./LiveKitVideoProvider";
import { createDailyProviderFromEnv } from "./DailyVideoProvider";

const providers = new Map<string, VideoProvider>();

export function registerVideoProvider(provider: VideoProvider) {
  providers.set(provider.key, provider);
}

export function getVideoProvider(key = "mock"): VideoProvider {
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
