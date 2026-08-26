// Measured, not estimated. Starlark and build_defs counted with wc over every
// .bzl outside examples; Go counted over non-test sources.
export interface Row {
  stack: string;
  note: string;
  rules: number;
  defs: number;
  go: number;
  tests: number;
}

export const ROWS: Row[] = [
  {
    stack: "Aspect rules_js",
    note: "layer 1 alone, before ts, esbuild, rollup, webpack, jest or lint",
    rules: 12,
    defs: 22834,
    go: 0,
    tests: 0,
  },
  {
    stack: "old js-rules",
    note: "one repo, esbuild embedded as a Go library",
    rules: 9,
    defs: 687,
    go: 5926,
    tests: 45,
  },
  {
    stack: "this stack",
    note: "four repos: node, js, ts, bundler",
    rules: 11,
    defs: 1033,
    go: 1574,
    tests: 16,
  },
];

export interface Verdict {
  claim: string;
  detail: string;
  kind: "win" | "loss";
}

export const VERDICTS: Verdict[] = [
  {
    claim: "node resolves modules, we do not",
    detail:
      "ModuleResolvePlugin reimplemented node's algorithm, subpath splitting included, because there was no node_modules. 442 more lines re-derived module format. All gone.",
    kind: "win",
  },
  {
    claim: "type errors fail the build",
    detail:
      "The old rules transpiled TypeScript through esbuild, which never type-checks. ts_library runs the compiler.",
    kind: "win",
  },
  {
    claim: "platform filtering is general",
    detail:
      "rules_esbuild spends 1,324 lines on a toolchain repository to fetch one platform tarball. Here it is a property of npm_repo, so every tool gets it: 1 of 26 fetched, 11MB against a 12KB stub.",
    kind: "win",
  },
  {
    claim: "no dev server",
    detail:
      "The old repo had a working one with HMR, 8,000 lines of it. We deferred it and have not replaced it.",
    kind: "loss",
  },
  {
    claim: "no tailwind, no lint, no test runner",
    detail:
      "Aspect ships rollup, webpack, terser, swc, jest, cypress, persistent workers and remote execution. We ship esbuild and vite.",
    kind: "loss",
  },
  {
    claim: "the next bundler is cheap",
    detail:
      "vite_bundle is 60 lines and built first try; esbuild_bundle is 110. Aspect spends 489 on rollup and 346 on terser because Bazel needs toolchains and repository rules around each one. Here they are flags over the same js_run_binary, so the gap in breadth is weeks, not years.",
    kind: "win",
  },
  {
    claim: "a third of the test coverage",
    detail:
      "16 test targets against the old repo's 45 — though every layer here was falsification-tested, each one broken on purpose to confirm the test could fail.",
    kind: "loss",
  },
];
