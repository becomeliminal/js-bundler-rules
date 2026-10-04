import { nodeResolve } from "@rollup/plugin-node-resolve";

// Both applications in one build, each its own entry: dist/tsc.js and
// dist/esbuild.js.
export default {
  input: { tsc: "main_tsc.js", esbuild: "main_esbuild.js" },
  plugins: [nodeResolve()],
  onwarn(warning, warn) {
    if (warning.code === "UNRESOLVED_IMPORT") {
      throw new Error(warning.message);
    }
    warn(warning);
  },
  output: {
    dir: "dist",
    format: "es",
  },
};
