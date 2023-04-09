/// <reference types="vitest" />
const { defineConfig } = require("vitest/config");
const { vanillaExtractPlugin } = require("@vanilla-extract/vite-plugin");

module.exports = defineConfig({
  plugins: [vanillaExtractPlugin()],
  test: {
    exclude: ["node_modules", "dist"],
    globals: true,
    environment: "jsdom",
    setupFiles: `${__dirname}/global.js`,
    passWithNoTests: true,
  },
});
