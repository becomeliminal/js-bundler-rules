const { test } = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const { execFileSync } = require("node:child_process");

const dir = "test/ts/treeshake";
const GHOST = "TREESHAKE_UNUSED_ENUM";

// rollup is what vite bundles a production build with; esbuild is the other
// bundler here. Each bundles the same application twice, against the library
// as the compiler emitted it and as esbuild did.
const BUNDLES = {
  rollup: { tsc: `${dir}/tsc.js`, esbuild: `${dir}/esbuild.js` },
  esbuild: { tsc: `${dir}/app_tsc.js`, esbuild: `${dir}/app_esbuild.js` },
};

for (const [bundler, bundles] of Object.entries(BUNDLES)) {
  test(`${bundler}: an unused enum stays when the compiler emitted the library`, () => {
    // The compiler writes an enum as a call nothing marks as harmless, so the
    // bundler must keep it. This is the cost the transpiler removes; if a
    // compiler ever stops paying it, this test says so.
    assert.ok(fs.readFileSync(bundles.tsc, "utf8").includes(GHOST));
  });

  test(`${bundler}: and is dropped when esbuild emitted it`, () => {
    assert.ok(!fs.readFileSync(bundles.esbuild, "utf8").includes(GHOST));
  });

  test(`${bundler}: both bundles run the same`, () => {
    for (const bundle of Object.values(bundles)) {
      assert.equal(execFileSync(process.execPath, [bundle], { encoding: "utf8" }), "state:on\n", bundle);
    }
  });
}
