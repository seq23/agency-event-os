const TEST_ENV_DEFAULTS: Record<string, string> = {
  AGENCY_EVENT_OS_RUNTIME_STORE: "file",
  ALLOW_FILE_RUNTIME_STORE_IN_PRODUCTION: "true",
  VIDEO_PROVIDER: "mock",
  ALLOW_MOCK_VIDEO_PROVIDER_IN_PRODUCTION: "true",
};

for (const [key, value] of Object.entries(TEST_ENV_DEFAULTS)) {
  process.env[key] = value;
}
