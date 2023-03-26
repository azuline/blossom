/// <reference types="vitest" />
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    exclude: ["node_modules", "dist"],
    globals: true,
    environment: "jsdom",
    setupFiles: "./global.ts",
    passWithNoTests: true,
  },
});
