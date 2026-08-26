const { test } = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");

const bundle = "test/js/webpack/bundle.js";

test("the bundle runs and carries the first-party library", () => {
  const { proclaim } = require(path.resolve(bundle));
  assert.strictEqual(proclaim("ada"), "[webpack] Hello, ada!");
});

test("the value the config required from a local file reached the output", () => {
  const { stamp } = require(path.resolve(bundle));
  assert.strictEqual(stamp, "assembled by webpack_bundle");
});
