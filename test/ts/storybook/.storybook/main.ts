import type { StorybookConfig } from "@storybook/react-vite";

// What a consumer writes: nothing in here knows about Please. storybook_build
// and storybook_dev wrap it.
const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-docs"],
  framework: { name: "@storybook/react-vite", options: {} },
  // The TypeScript compiler reads the props, rather than react-docgen's
  // babel pass: the most complete prop tables, and the slow path a build
  // action must still manage.
  typescript: { reactDocgen: "react-docgen-typescript" },
};

export default config;
