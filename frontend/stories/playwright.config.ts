import { defineConfig } from "@playwright/test";

export default defineConfig({
  fullyParallel: true,
  workers: process.env.NUM_WORKERS,
});
