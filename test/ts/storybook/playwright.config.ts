import { defineConfig, devices } from "@playwright/test";

// A suite over the static Storybook, the shape a visual-regression suite
// takes: each story rendered alone at /iframe.html, compared with a recorded
// snapshot. Text, so one snapshot serves every platform; a screenshot's path
// would name {platform}, since browsers rasterise differently on each.
export default defineConfig({
  testDir: "./e2e",
  snapshotPathTemplate: "{testDir}/__snapshots__/{arg}{ext}",
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
