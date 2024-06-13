/// <reference types="vitest" />
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import react from "@vitejs/plugin-react-swc";
import analyze from "rollup-plugin-analyzer";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), vanillaExtractPlugin()],
  build: {
    outDir: "build",
    rollupOptions: {
      // Some minor type compatibility issue in between versions, doesn't really matter.
      // @ts-expect-error Rollup plugin types are subtly different doesn't match up.
      plugins: process.env.ANALYZE != null ? [analyze()] : [],
    },
  },
  server: {
    host: "127.0.0.1",
    proxy: {
      "/api": "http://127.0.0.1:40851",
    },
  },
});
