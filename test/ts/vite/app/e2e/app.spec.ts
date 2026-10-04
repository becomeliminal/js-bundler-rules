import { expect, test } from "@playwright/test";

// The built app, served as vercel_site would serve it, in the pinned browser.
test("the bundle renders, first-party library included", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Smaller, and not finished");
  // @test/greeter, compiled by ts-rules and bundled by vite: the whole stack.
  await expect(page.locator(".greeting")).toHaveText("Hello, Please!");
});

test("an app route falls back to index.html", async ({ request }) => {
  const res = await request.get("/some/deep/route");
  expect(res.status()).toBe(200);
  expect(await res.text()).toContain("<title>Smaller, and Not Finished</title>");
});

test("a missing asset is a 404, not the app", async ({ request }) => {
  expect((await request.get("/assets/does-not-exist.js")).status()).toBe(404);
});
