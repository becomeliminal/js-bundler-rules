import { describe, it, expect } from "vitest";
import { ROWS, VERDICTS } from "./data";

// Transformed by the same vite config the bundle uses, which is the reason
// vitest lives beside vite_bundle: point it at a different config and the thing
// under test is not the thing that ships.
describe("the data the page draws itself from", () => {
  it("has a row per stack", () => {
    expect(ROWS).toHaveLength(3);
    expect(ROWS.map((r) => r.stack)).toContain("this stack");
  });

  it("counts nothing it did not measure", () => {
    for (const row of ROWS) {
      expect(row.defs).toBeGreaterThan(0);
      expect(row.rules).toBeGreaterThan(0);
    }
  });

  it("is honest in both directions", () => {
    const kinds = new Set(VERDICTS.map((v) => v.kind));
    expect(kinds).toContain("win");
    expect(kinds).toContain("loss");
  });
});
