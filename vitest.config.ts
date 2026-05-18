import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  cacheDir: ".vitest-cache",
  test: {
    environment: "node",
    globals: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
