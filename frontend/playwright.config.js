import { defineConfig } from "@playwright/test";
import os from "os";
export default defineConfig({
    fullyParallel: true,
    workers: os.cpus().length,
});
//# sourceMappingURL=playwright.config.js.map