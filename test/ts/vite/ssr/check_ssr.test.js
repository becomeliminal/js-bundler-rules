const { test } = require("node:test");
const assert = require("node:assert");
const path = require("node:path");
const { pathToFileURL } = require("node:url");

test("the server bundle renders the app to markup under node", async () => {
  const mod = await import(
    pathToFileURL(path.resolve("test/ts/vite/ssr/entry-server.mjs"))
  );
  const html = mod.render();
  // The first-party library answered through react's server renderer.
  assert.match(html, /<h1>Hello, server!<\/h1>/);
  assert.match(html, /data-rendered="ssr"/);
});
