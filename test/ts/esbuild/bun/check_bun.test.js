const { test } = require("node:test");
const assert = require("node:assert");
const path = require("node:path");

test("the Bun-checked TypeScript bundle runs", () => {
  const { greeting } = require(path.resolve("test/ts/esbuild/bun/bundle.js"));
  assert.strictEqual(greeting("Ada"), "Hello, Ada!");
});
