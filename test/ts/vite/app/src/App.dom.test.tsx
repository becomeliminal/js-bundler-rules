// @vitest-environment jsdom
//
// The nim-web shape: a component rendered into a real DOM API, no browser.
// The environment comment is vitest's own per-file switch, so the node-env
// tests in this same target stay on node.
import { expect, test } from "vitest";
import { createRoot } from "react-dom/client";
import { act } from "react";
import { App } from "./App";

test("the component renders into a jsdom document", async () => {
  const el = document.createElement("div");
  document.body.appendChild(el);
  await act(async () => {
    createRoot(el).render(<App />);
  });
  expect(el.textContent).toContain("Hello");
});
