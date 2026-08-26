const { test } = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");

const dir = "test/js/terser";

test("the minified bundle is smaller", () => {
  const before = fs.statSync(`${dir}/bundle.js`).size;
  const after = fs.statSync(`${dir}/min/bundle.js`).size;
  assert.ok(after < before, `minified ${after} bytes >= original ${before}`);
});

// The part that matters: a minifier that breaks the code still produces a
// smaller file.
test("the minified bundle still runs", () => {
  const lib = require(path.resolve(`${dir}/min/bundle.js`));
  assert.strictEqual(lib.elaborateGreetingForOccasion("ada"), "Hello, ada!");
});

test("a directory of bundles minifies file by file", () => {
  for (const entry of ["alpha", "beta"]) {
    const before = fs.statSync(`${dir}/${entry}.js`).size;
    const after = fs.statSync(`${dir}/min_many/${entry}.js`).size;
    assert.ok(after < before, `${entry}: minified ${after} >= original ${before}`);
  }
  const beta = require(path.resolve(`${dir}/min_many/beta.js`));
  assert.match(beta.betaGreetingWithConsiderableCeremony(), /beta says/);
});
