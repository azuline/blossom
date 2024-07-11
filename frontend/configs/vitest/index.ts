/// <reference types="vitest" />
import { defineConfig } from "vitest/config";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";

export default defineConfig({
  plugins: [vanillaExtractPlugin()],
  test: {
    exclude: ["node_modules", "dist"],
    globals: true,
    environment: "jsdom",
    setupFiles: `${import.meta.dirname}/global.js`,
    passWithNoTests: true,
  },
});
