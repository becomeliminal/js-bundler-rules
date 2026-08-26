import { greet } from "@test/greeter";

// Deliberately verbose: long names, a comment terser will drop, and a branch
// it can fold. The size assertion needs something to shrink.
export function elaborateGreetingForOccasion(honouredGuestName) {
  const alwaysTrueButNotObviouslySo = 1 + 1 === 2;
  if (alwaysTrueButNotObviouslySo) {
    return greet(honouredGuestName);
  }
  return "unreachable, and terser knows it";
}
