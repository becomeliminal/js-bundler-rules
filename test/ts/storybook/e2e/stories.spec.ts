import { expect, test } from "@playwright/test";

// Storybook's own index of the stories it built, so a new story is covered
// the moment it lands.
test("every story renders and matches its snapshot", async ({ page, request }) => {
  const index = await (await request.get("/index.json")).json();
  const stories = Object.values(index.entries as Record<string, { id: string; type: string }>)
    .filter((e) => e.type === "story");
  expect(stories.length).toBeGreaterThan(0);
  for (const { id } of stories) {
    await page.goto(`/iframe.html?id=${id}&viewMode=story`);
    const text = await page.locator(".greeting").textContent();
    expect(text).toMatchSnapshot(`${id}.txt`);
  }
});
