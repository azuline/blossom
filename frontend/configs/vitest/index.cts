/// <reference types="vitest" />
const { defineConfig } = require("vitest/config");

module.exports = defineConfig({
  test: {
    exclude: ["node_modules", "dist"],
    globals: true,
    environment: "jsdom",
    setupFiles: `${__dirname}/global.js`,
    passWithNoTests: true,
  },
});
