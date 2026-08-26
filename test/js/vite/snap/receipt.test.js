import { expect, test } from "vitest";
import { receipt } from "./receipt.js";

test("a receipt keeps its shape", () => {
  expect(receipt({ customer: "ada", items: ["tea", "scone"] })).toMatchSnapshot();
});

test("an inline snapshot lives in this file, and vitest maintains it", () => {
  expect(receipt({ customer: "bob", items: ["jam"] }).header).toMatchInlineSnapshot(`"Hello, bob!"`);
});
