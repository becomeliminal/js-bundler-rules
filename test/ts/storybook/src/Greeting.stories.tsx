import type { Meta, StoryObj } from "@storybook/react-vite";

import { Greeting } from "@/Greeting";

const meta = {
  title: "Greeting",
  component: Greeting,
  tags: ["autodocs"],
} satisfies Meta<typeof Greeting>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Quiet: Story = { args: { who: "Please" } };
export const Loud: Story = { args: { who: "Please", loud: true } };
