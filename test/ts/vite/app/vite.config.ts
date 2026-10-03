import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

// The plugin is imported by name from the consumer's tree, which is why vite is
// pinned there too: this has to match the vite it is loaded into.
//
// The "@" alias is the shape nearly every real app uses, and the one a copied
// config makes hard: __dirname is the run directory, so "@/x" resolves there
// rather than in the repository. verify_hmr.sh proves a file created mid-session
// is reachable through it.
export default defineConfig({
  plugins: [react()],
  resolve: { alias: { "@": path.resolve(__dirname, "src") } },
  build: { outDir: "dist", emptyOutDir: true },
});
