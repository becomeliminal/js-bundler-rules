import { defineConfig } from "vite";

// Multiple HTML entry points, which is vite's own multi-page recipe: one input
// per page, each html pulling its own module. Relative paths resolve against
// the project root, which is where the build runs.
export default defineConfig({
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: "index.html",
        admin: "admin/index.html",
      },
    },
  },
});
