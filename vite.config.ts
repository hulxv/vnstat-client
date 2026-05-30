import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  publicDir: "src/public",

  // Vite options tailored for Tauri development and production.
  // prevent vite from obscuring rust errors
  clearScreen: false,
  server: {
    port: 5173,
    // tauri expects a fixed port, fail if that port is not available
    strictPort: true,
    watch: {
      // tell vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"],
    },
  },

  resolve: {
    alias: {
      "@Components": resolve(__dirname, "src/components"),
      "@Context": resolve(__dirname, "src/context"),
      "@Pages": resolve(__dirname, "src/pages"),
      "@Layout": resolve(__dirname, "src/layout"),
      "@Util": resolve(__dirname, "src/util"),
      "@Types": resolve(__dirname, "src/types"),
    },
  },

  // env variables starting with the item of `envPrefix` will be exposed in
  // the tauri's webview and you can access them with `import.meta.env`
  envPrefix: ["VITE_", "TAURI_ENV_*"],

  build: {
    // Tauri uses Chromium on Windows and WebKit on macOS and Linux
    target:
      process.env.TAURI_ENV_PLATFORM == "windows" ? "chrome105" : "safari13",
    // don't minify for debug builds
    minify: !process.env.TAURI_ENV_DEBUG ? "esbuild" : false,
    // produce sourcemaps for debug builds
    sourcemap: !!process.env.TAURI_ENV_DEBUG,
    outDir: "dist",
  },
});
