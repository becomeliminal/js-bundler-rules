import { greet } from "@test/greeter";

export function proclaim(who) {
  return `[webpack] ${greet(who)}`;
}

// __STAMP__ is injected by the config from a file the config require()d.
export const stamp = __STAMP__;
