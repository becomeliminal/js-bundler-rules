const { test, describe } = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");

const dir = "test/js/esbuild/multi";
const files = fs.readdirSync(dir).filter((f) => f.endsWith(".js") || f.endsWith(".map") || f.endsWith(".json"));

describe("two entries, one graph", () => {
  test("both entries are emitted", () => {
    for (const e of ["page_a.js", "page_b.js"]) {
      assert.ok(files.includes(e), `${e} missing from ${files}`);
    }
  });

  test("the shared library is split once, not copied into each entry", () => {
    const chunks = files.filter((f) => f.startsWith("chunk-"));
    assert.ok(chunks.length >= 1, `no shared chunk in ${files}`);
    const inline = ["page_a.js", "page_b.js"].filter((e) =>
      fs.readFileSync(`${dir}/${e}`, "utf8").includes("Hello,"));
    assert.equal(inline.length, 0, "the library was duplicated into the entries");
  });

  test("the metafile names every entry and the library", () => {
    const meta = JSON.parse(fs.readFileSync(`${dir}/bundle.meta.json`, "utf8"));
    const outputs = Object.keys(meta.outputs);
    assert.ok(outputs.some((o) => o.endsWith("page_a.js")));
    assert.ok(outputs.some((o) => o.endsWith("page_b.js")));
    const inputs = Object.values(meta.outputs).flatMap((o) => Object.keys(o.inputs || {}));
    assert.ok(inputs.some((i) => i.includes("@test/greeter")), `greeter not in ${inputs}`);
  });

  test("the sourcemaps locate errors without publishing the source", () => {
    const map = JSON.parse(fs.readFileSync(`${dir}/page_a.js.map`, "utf8"));
    assert.ok(map.sources.length > 0, "a map with no sources locates nothing");
    const content = (map.sourcesContent || []).filter(Boolean);
    assert.equal(content.length, 0, "sources_content = False, yet the source shipped in the map");
  });
});
