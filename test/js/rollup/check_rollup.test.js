const { test } = require("node:test");
const assert = require("node:assert");
const path = require("node:path");
const { pathToFileURL } = require("node:url");

// Running the output is the assertion: the first-party chain resolved through
// the tree Please assembled, was bundled in, and still answers.
test("the bundle runs and carries the first-party library", async () => {
  const mod = await import(
    pathToFileURL(path.resolve("test/js/rollup/bundle.mjs"))
  );
  assert.strictEqual(mod.announce("ada"), "[rollup] Hello, ada!");
});
