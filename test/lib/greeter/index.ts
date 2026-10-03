// A first-party TypeScript library. Every fixture in this repo imports it by
// name -- the esbuild bundles under node, the React application under vite --
// so it is also the thing that proves those two resolve the same package the
// same way.
import { BANG } from "./parts/punctuation";

export function greet(who: string): string {
  return `Hello, ${who}${BANG}`;
}
