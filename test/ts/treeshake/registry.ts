// A module that computes something when it is loaded: a formatter built at its
// top level, as money code has them. Harmless, and nothing a bundler can prove
// harmless -- constructing one could do anything, for all it knows. Nothing in
// the application uses what this exports, so whether it reaches a bundle is
// decided by whether the library's manifest says its files have no side
// effects.
export const FORMATTED: string = `${new Intl.NumberFormat("en-GB").format(1)} TREESHAKE_UNUSED_MODULE`;
