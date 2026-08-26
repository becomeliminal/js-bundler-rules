import { greet } from "@test/greeter";

export function announce(who) {
  return `[rollup] ${greet(who)}`;
}
