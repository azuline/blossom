import { defineConfig } from "@playwright/test";
import os from "os";

export default defineConfig({
  testDir: "visualtest",
  fullyParallel: true,
  workers: os.cpus().length,
});
