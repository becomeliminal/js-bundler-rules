import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// The plugin is imported by name from the consumer's tree, which is why vite is
// pinned there too: this has to match the vite it is loaded into.
export default defineConfig({
  plugins: [react()],
  build: { outDir: "dist", emptyOutDir: true },
});
