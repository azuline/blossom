/// <reference types="vitest" />
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import react from "@vitejs/plugin-react-swc";
import analyze from "rollup-plugin-analyzer";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), vanillaExtractPlugin()],
  build: {
    rollupOptions: {
      plugins: process.env.ANALYZE != null ? [analyze()] : [],
    },
  },
  server: {
    // This is docker's host, which we use so that the Playwright container can connect
    // to the server. We could use 0.0.0.0, but then the LAN can access the devserver
    // too.
    //
    // I'm not sure how this works on computers without Docker installed, but you should
    // have Docker installed!
    host: "127.0.0.1",
    // Don't open by default.
    open: false,
    proxy: {
      "/api": "http://127.0.0.1:40851",
    },
  },
  test: {
    exclude: [".ladle", "visualtest", "node_modules", "dist"],
    globals: true,
    environment: "jsdom",
    // setupFiles: "./vitest.global.ts",
  },
});
