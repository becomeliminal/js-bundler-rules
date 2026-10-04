subinclude("//build_defs:bundler", "///js//build_defs:js", "///ts//build_defs:ts")

# Why a ts_library's JavaScript is worth handing to a transpiler, measured
# where it matters: in a bundle. One library, emitted by the compiler and by
# esbuild, and an application that uses one of its two enums. The compiler
# writes an enum as a call nothing marks as free of side effects, so a bundler
# keeps the one nobody uses; esbuild marks it, and it is gone.
for emitter in [
    "tsc",
    "esbuild",
]:
    ts_library(
        name = f"statuses_{emitter}",
        package = f"@test/statuses-{emitter}",
        srcs = ["statuses.ts"],
        entry = "statuses.ts",
        module_type = "module",
        transpiler = emitter,
        tsconfig_deps = ["//:tsconfig.json"],
    )

    esbuild_bundle(
        name = f"app_{emitter}",
        entry_point = f"main_{emitter}.js",
        out = f"app_{emitter}.js",
        format = "esm",
        platform = "node",
        deps = [f":statuses_{emitter}"],
    )

rollup_bundle(
    name = "rollup",
    srcs = [
        "main_esbuild.js",
        "main_tsc.js",
    ],
    node_modules = "//third_party/js/react:node_modules",
    deps = [
        ":statuses_esbuild",
        ":statuses_tsc",
    ],
)

js_test(
    name = "treeshake_test",
    srcs = ["treeshake.test.js"],
    data = [
        ":app_esbuild",
        ":app_tsc",
        ":rollup",
    ],
)
