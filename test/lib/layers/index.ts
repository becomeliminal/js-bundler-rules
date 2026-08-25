// The data the page draws itself from. It lives in a separate package on
// purpose: the page can only render if esbuild resolved this by name and
// inlined it, so a blank page is a failed bundle.
//
// A ts_library rather than a js_library, so a consumer importing it is checked
// against these types instead of silently getting `any`. That is not
// hypothetical -- it was a js_library, and ts_check found it.
export interface Layer {
  n: number;
  repo: string;
  role: string;
  rule: string;
  hands: string;
}

export interface Fact {
  k: string;
  v: string;
  note: string;
}

export const LAYERS: Layer[] = [
  { n: 0, repo: "node-rules", role: "Pins the runtime", rule: "node_toolchain", hands: "a hermetic node" },
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
    rule: "ts_library · ts_check · ts_binary",
    hands: ".js beside .d.ts",
  },
  {
    n: 3,
    repo: "js-bundler-rules",
    role: "Turns a repo into something you can ship",
    rule: "esbuild_bundle · vite_bundle",
    hands: "this page",
  },
];

export const FACTS: Fact[] = [
  { k: "esbuild platform packages in the lockfile", v: "26", note: "" },
  { k: "fetched for this machine", v: "1", note: "11 MB vs a 12 KB stub" },
  { k: "rebuild of this bundle", v: "byte-identical", note: "checked by cmp" },
  { k: "Go in please_js replaced by node's own resolver", v: "442 lines", note: "cjs_fixup, cjs_detect" },
];
