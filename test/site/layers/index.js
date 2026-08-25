// The data the page draws itself from. It lives in a separate package on
// purpose: the page can only render if esbuild resolved this by name and
// inlined it, so a blank page is a failed bundle.
exports.LAYERS = [
  {
    n: 0,
    repo: "node-rules",
    role: "Pins the runtime",
    rule: "node_toolchain",
    hands: "a hermetic node",
  },
  {
    n: 1,
    repo: "js-rules",
    role: "Fetches packages, assembles node_modules, runs programs",
    rule: "npm_repo · js_library · js_run_binary",
    hands: "a real node_modules",
  },
  {
    n: 2,
    repo: "ts-rules",
    role: "Compiles TypeScript, makes type errors build failures",
    rule: "ts_library · ts_binary · ts_test",
    hands: ".js beside .d.ts",
  },
  {
    n: 3,
    repo: "js-bundler-rules",
    role: "Turns a repo into something you can ship",
    rule: "esbuild_bundle",
    hands: "this page",
  },
];

exports.FACTS = [
  { k: "esbuild platform packages in the lockfile", v: "26", note: "" },
  { k: "fetched for this machine", v: "1", note: "11 MB vs a 12 KB stub" },
  { k: "rebuild of this bundle", v: "byte-identical", note: "checked by cmp" },
  { k: "Go in please_js replaced by node's own resolver", v: "442 lines", note: "cjs_fixup, cjs_detect" },
];
