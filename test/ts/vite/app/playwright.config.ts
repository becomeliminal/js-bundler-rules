import { defineConfig, devices } from "@playwright/test";

// playwright_test replaces webServer, baseURL and the browser; everything else
// here -- projects, retries, timeouts -- applies as written.
export default defineConfig({
  testDir: "./e2e",
  retries: process.env.CI ? 1 : 0,
  // A failure writes its trace, so the fixture exercises where artifacts land.
  use: { trace: "retain-on-failure" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
