import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

// Storybook's vite builder merges the project's own vite config, so the "@"
// alias here must reach the stories, in the build and in the dev server.
export default defineConfig({
  plugins: [react()],
  resolve: { alias: { "@": path.resolve(__dirname, "src") } },
});
