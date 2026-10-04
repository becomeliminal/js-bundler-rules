import { defineConfig, devices } from "@playwright/test";

// playwright_test replaces webServer, baseURL and the browser; everything else
// here -- projects, retries, timeouts -- applies as written.
export default defineConfig({
  testDir: "./e2e",
  retries: process.env.CI ? 1 : 0,
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
