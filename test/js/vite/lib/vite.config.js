import { defineConfig } from "vite";

// Library mode. Unlike an app build nothing here is content-hashed: fileName
// makes the outputs nameable, which is what lets a consumer -- and the test --
// import them by path.
export default defineConfig({
  build: {
    lib: {
      entry: "src/index.js",
      name: "shouter",
      formats: ["es", "cjs"],
      fileName: "shouter",
    },
    outDir: "dist",
    emptyOutDir: true,
  },
});
