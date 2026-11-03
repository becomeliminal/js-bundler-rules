subinclude("//build_defs:bundler", "///js//build_defs:js", "///ts//build_defs:ts")

# The target remains a normal ts_check dependency to the bundler. The checker
# backend changes; the bundle contract does not.
esbuild_bundle(
    name = "bundle",
    entry_point = "src/main.ts",
    check = ":typecheck",
    format = "cjs",
    out = "bundle.js",
    platform = "node",
)

ts_check(
    name = "typecheck",
    srcs = ["src/main.ts"],
    compiler = "///node//third_party/bun:bun|bun",
    tsconfig = "tsconfig.json",
    tsconfig_deps = ["//:tsconfig.json"],
)

js_test(
    name = "bun_bundle_test",
    srcs = ["check_bun.test.js"],
    data = [":bundle"],
)
