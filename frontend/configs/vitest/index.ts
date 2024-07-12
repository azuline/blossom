/// <reference types="vitest" />
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import { defineConfig, UserConfig } from "vitest/config";

const config: UserConfig = defineConfig({
  plugins: [vanillaExtractPlugin()],
  test: {
    exclude: ["node_modules", "dist"],
    globals: true,
    environment: "jsdom",
    setupFiles: `${import.meta.dirname}/global.js`,
    passWithNoTests: true,
  },
});
export default config;
