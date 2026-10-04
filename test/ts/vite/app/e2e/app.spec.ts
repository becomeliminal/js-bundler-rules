import { expect, test } from "@playwright/test";

// The built app, served as vercel_site would serve it, in the pinned browser.
test("the bundle renders, first-party library included", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Smaller, and not finished");
  // @test/greeter, compiled by ts-rules and bundled by vite: the whole stack.
  await expect(page.locator(".greeting")).toHaveText("Hello, Please!");
  // Imported as a directory of the library, `@test/greeter/parts`.
  await expect(page.locator(".greeting")).toHaveAttribute("data-bang", "!");
});

test("an app route falls back to index.html", async ({ request }) => {
  const res = await request.get("/some/deep/route");
  expect(res.status()).toBe(200);
  expect(await res.text()).toContain("<title>Smaller, and Not Finished</title>");
});

test("a missing asset is a 404, not the app", async ({ request }) => {
  expect((await request.get("/assets/does-not-exist.js")).status()).toBe(404);
});

// Only the suite that asks for a fixed origin says which one to expect.
test("the site is served from the origin the suite asked for", async ({ page }) => {
  const expected = process.env.EXPECT_ORIGIN;
  test.skip(!expected, "this suite takes any free port");
  await page.goto("/");
  expect(await page.evaluate(() => window.location.origin)).toBe(expected);
});
