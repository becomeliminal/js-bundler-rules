// The plugin is imported by name from the consumer's tree -- the reason
// rollup is pinned there too. Without it rollup treats every bare import as
// external and the first-party library never enters the bundle.
import { nodeResolve } from "@rollup/plugin-node-resolve";

export default {
  input: "entry.js",
  plugins: [nodeResolve()],
  // Rollup's default on an import nothing resolves is a warning and an
  // external import -- a bundle that builds green and explodes at runtime.
  // This is rollup's own documented recipe for refusing that, and it lives
  // here because the config is the interface: the rule adds no opinion.
  onwarn(warning, warn) {
    if (warning.code === "UNRESOLVED_IMPORT") {
      throw new Error(warning.message);
    }
    warn(warning);
  },
  output: {
    dir: "dist",
    format: "esm",
    entryFileNames: "bundle.mjs",
  },
};
