// A path alias, not a package: nothing in any node_modules answers to
// "#util". Only the tsconfig's paths mapping can resolve this, which is what
// the tsconfig argument exists for.
import { shout } from "#util/shout";
import { greet } from "@test/greeter";

export function announce(who: string): string {
  return shout(greet(who));
}
