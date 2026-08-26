const { test } = require("node:test");
const assert = require("node:assert");
const path = require("node:path");
const { pathToFileURL } = require("node:url");

// Importable, not merely present: loading the output and calling it is what
// proves the bundle is a working module -- and that @test/greeter was
// resolved into it, since nothing else could answer.
const dir = "test/js/vite/lib";

// With no package.json in the output to say otherwise, node reads .js as
// CommonJS -- so that is the extension vite gives the cjs build, and the es
// build gets .mjs.
test("the cjs build loads under require()", () => {
  const lib = require(path.resolve(`${dir}/shouter.js`));
  assert.strictEqual(lib.shout("ada"), "HELLO, ADA!");
});

test("the es build loads under import()", async () => {
  const lib = await import(pathToFileURL(path.resolve(`${dir}/shouter.mjs`)));
  assert.strictEqual(lib.shout("ada"), "HELLO, ADA!");
});
