import { describe, it, expect } from "vitest";
import { renderToString } from "react-dom/server";
import { App } from "./App";

// Vitest transforming .jsx through the same vite.config.js the bundle uses.
// No TypeScript in the test, the source, or the config.
describe("a component written in plain JavaScript", () => {
  it("is a function component like any other", () => {
    expect(typeof App).toBe("function");
  });

  it("renders, reaching its first-party library on the way", () => {
    // Rendered rather than called: a component using hooks cannot be invoked
    // directly, and rendering is what proves the plugin's transform produced
    // something React will actually run.
    const html = renderToString(<App />);
    expect(html).toContain("Hello, Please!");
    // React separates adjacent text nodes with comments when it renders to a
    // string, so the count is not literally beside the word.
    expect(html).toMatch(/clicked.*0/s);
  });
});
