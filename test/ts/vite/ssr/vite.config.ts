import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    // An SSR build: the entry is a module, not an html, and the output runs
    // under node rather than in a browser.
    ssr: "src/entry-server.tsx",
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      // .mjs because node decides module syntax by extension and this package
      // has no package.json to decide it for him -- for it. The name is fixed:
      // a server entry is executed by path, so it must have one.
      output: { entryFileNames: "entry-server.mjs" },
    },
  },
  // Self-contained on purpose. By default an SSR build externalizes
  // dependencies and expects a node_modules beside it at runtime; this output
  // runs from a bare directory, so react is bundled in.
  ssr: { noExternal: true },
});
