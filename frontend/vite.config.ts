/// <reference types="vitest" />
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import react from "@vitejs/plugin-react-swc";
import fs from "fs";
import path from "path";
import analyze from "rollup-plugin-analyzer";
import { defineConfig } from "vite";

const excludedAliases = ["node_modules", "coverage", "public", "dist", "patches"];
// dprint-ignore
const alias = Object.fromEntries(
  fs.readdirSync(".", { withFileTypes: true })
    .filter(x => x.isDirectory())
    .map(x => x.name)
    .filter(x => !excludedAliases.includes(x))
    .map(x => [`@${x}`, path.resolve(__dirname, `./${x}`)]),
);

// https://vitejs.dev/config/
export default defineConfig({
  resolve: { alias },
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
    exclude: [".ladle", "node_modules", "dist"],
  },
});
