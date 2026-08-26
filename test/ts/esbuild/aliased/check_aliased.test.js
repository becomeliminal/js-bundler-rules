const { test } = require("node:test");
const assert = require("node:assert");
const path = require("node:path");

test("the alias resolved through the tsconfig and the output runs", () => {
  const { announce } = require(path.resolve("test/ts/esbuild/aliased/bundle.js"));
  assert.strictEqual(announce("ada"), "HELLO, ADA!");
});
