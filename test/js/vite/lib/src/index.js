// A library, not an application: no index.html, no DOM. The first-party
// dependency is here so library mode proves the same resolution the app
// fixtures do -- a lib that only bundled its own file would prove less.
import { greet } from "@test/greeter";

export function shout(who) {
  return greet(who).toUpperCase();
}
