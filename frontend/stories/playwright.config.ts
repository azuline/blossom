import { defineConfig } from "@playwright/test";
import os from "os";

export default defineConfig({
  fullyParallel: true,
  workers: os.cpus().length,
  testIgnore: "dist/**"
});
