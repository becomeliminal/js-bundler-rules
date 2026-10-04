// Writes the React version it imported to the path it is given, relative to
// where it runs: what esbuild_binary promises, from this package's directory.
import { writeFileSync } from "node:fs";
import { version } from "react";

const [out] = process.argv.slice(2);
if (!out) {
  console.error("usage: stamp <out-file>");
  process.exit(2);
}
writeFileSync(out, `ESBUILD_BINARY_MARKER react ${version}\n`);
