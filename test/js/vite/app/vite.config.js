import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// A JavaScript config, not a TypeScript one. Nothing about vite requires
// TypeScript, and a repo that has not adopted it should not have to write its
// build config in it.
export default defineConfig({
  plugins: [react()],
  build: { outDir: "dist", emptyOutDir: true },
});
