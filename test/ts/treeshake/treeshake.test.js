const { test } = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const { execFileSync } = require("node:child_process");

const dir = "test/ts/treeshake";
const UNUSED_ENUM = "TREESHAKE_UNUSED_ENUM";
const UNUSED_MODULE = "TREESHAKE_UNUSED_MODULE";

// rollup is what vite bundles a production build with; esbuild is the other
// bundler here. Each bundles the same application against the library built
// three ways (see BUILD).
const BUNDLERS = {
  rollup: (build) => `${dir}/${build}.js`,
  esbuild: (build) => `${dir}/app_${build}.js`,
};

// What each build of the library leaves in a bundle that uses neither.
const KEPT = {
  tsc: { enum: true, module: true },
  esbuild: { enum: false, module: true },
  declared: { enum: false, module: false },
};

for (const [bundler, at] of Object.entries(BUNDLERS)) {
  for (const [build, kept] of Object.entries(KEPT)) {
    test(`${bundler}, library built as ${build}: what an unused enum and module cost`, () => {
      const bundle = fs.readFileSync(at(build), "utf8");
      // Both directions are asserted. The cost a transpiler and the manifest
      // remove is real only while the plain build still pays it; if a compiler
      // or a bundler ever stops, this says so.
      assert.equal(bundle.includes(UNUSED_ENUM), kept.enum, "the unused enum");
      assert.equal(bundle.includes(UNUSED_MODULE), kept.module, "the unused module");
    });

    test(`${bundler}, library built as ${build}: the application runs`, () => {
      assert.equal(execFileSync(process.execPath, [at(build)], { encoding: "utf8" }), "state:on\n");
    });
  }
}
