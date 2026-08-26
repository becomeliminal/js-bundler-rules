import { greet } from "@test/greeter";

// Structured output is what snapshots are for: nobody wants to hand-assert
// every field of this, and nobody should -- the reviewer reads the diff.
export function receipt(order) {
  return {
    header: greet(order.customer),
    lines: order.items.map((item, n) => `${n + 1}. ${item}`),
    total: order.items.length,
  };
}
