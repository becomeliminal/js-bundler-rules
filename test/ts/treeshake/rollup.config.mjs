import { nodeResolve } from "@rollup/plugin-node-resolve";

// Every application in one build, each its own entry: dist/tsc.js,
// dist/esbuild.js and dist/declared.js.
export default {
  input: { tsc: "main_tsc.js", esbuild: "main_esbuild.js", declared: "main_declared.js" },
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
