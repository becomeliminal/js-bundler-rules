// A camera over the static Storybook: serves it on loopback, screenshots one
// story to a PNG through Playwright's own API. What playwright_binary exists
// for. Paths are relative to this package, where playwright_binary runs it.
//
//   plz run //test/ts/storybook:capture -- <storybook-dir> <story-id> <out.png>
import { mkdirSync, readFileSync, statSync } from "node:fs";
import { createServer } from "node:http";
import type { AddressInfo } from "node:net";
import { dirname, extname, join, resolve } from "node:path";

import { chromium } from "@playwright/test";

const [site, story, out] = process.argv.slice(2);
if (!site || !story || !out) {
  console.error("usage: capture <storybook-dir> <story-id> <out.png>");
  process.exit(2);
}

const root = resolve(site);
const types: Record<string, string> = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json" };
const server = createServer((req, res) => {
  const file = join(root, new URL(req.url ?? "/", "http://x").pathname);
  try {
    if (!statSync(file).isFile()) throw new Error("not a file");
    res.writeHead(200, { "content-type": types[extname(file)] ?? "application/octet-stream" }).end(readFileSync(file));
  } catch {
    res.writeHead(404).end();
  }
});
await new Promise<void>((done) => server.listen(0, "127.0.0.1", done));
const { port } = server.address() as AddressInfo;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 400, height: 200 } });
await page.goto(`http://127.0.0.1:${port}/iframe.html?id=${story}&viewMode=story`);
await page.locator(".greeting").waitFor();
mkdirSync(dirname(resolve(out)), { recursive: true });
await page.screenshot({ path: out });
await browser.close();
server.close();
console.log(`captured ${story} -> ${resolve(out)}`);
