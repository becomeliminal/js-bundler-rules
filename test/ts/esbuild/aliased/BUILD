subinclude("//build_defs:bundler", "///js//build_defs:js", "///ts//build_defs:ts")

# The import "#util/shout" is a tsconfig path alias -- no node_modules entry
# answers to it, so removing the tsconfig argument fails resolution, which is
# the proof it is doing the work.
esbuild_bundle(
    name = "bundle",
    srcs = glob(["src/**/*.ts"]),
    check = ":typecheck",
    entry_point = "src/main.ts",
    format = "cjs",
    tsconfig = "tsconfig.json",
    out = "bundle.js",
    platform = "node",
    tsconfig_deps = ["//:tsconfig.json"],
    deps = ["//test/lib/greeter"],
)

ts_check(
    name = "typecheck",
    srcs = glob(["src/**/*.ts"]),
    deps = ["//test/lib/greeter"],
    tsconfig_deps = ["//:tsconfig.json"],
)

js_test(
    name = "aliased_test",
    srcs = ["check_aliased.test.js"],
    data = [":bundle"],
)
