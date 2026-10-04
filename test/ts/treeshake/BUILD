subinclude("//build_defs:bundler", "///js//build_defs:js", "///ts//build_defs:ts")

# What decides whether a library's unused code reaches an application's bundle,
# measured where it matters: in the bundle. One library, built three ways, and
# an application that uses one of its two enums and nothing from its second
# module.
#
#   tsc       the compiler emits it. An enum is a call nothing marks as free of
#             side effects, so a bundler keeps the one nobody uses.
#   esbuild   esbuild emits it, and marks the enum: the unused one is gone.
#   declared  as esbuild, and the library says its files have no side effects
#             (side_effects = False): the module nobody imports from is gone
#             too, though it runs a call when loaded.
_BUILDS = {
    "tsc": ("tsc", None),
    "esbuild": ("esbuild", None),
    "declared": ("esbuild", False),
}

for build, how in _BUILDS.items():
    transpiler, side_effects = how

    ts_library(
        name = f"statuses_{build}",
        package = f"@test/statuses-{build}",
        srcs = [
            "index.ts",
            "registry.ts",
            "statuses.ts",
        ],
        module_type = "module",
        side_effects = side_effects,
        transpiler = transpiler,
        tsconfig_deps = ["//:tsconfig.json"],
    )

    esbuild_bundle(
        name = f"app_{build}",
        entry_point = f"main_{build}.js",
        out = f"app_{build}.js",
        format = "esm",
        platform = "node",
        deps = [f":statuses_{build}"],
    )

rollup_bundle(
    name = "rollup",
    srcs = [f"main_{build}.js" for build in _BUILDS.keys()],
    node_modules = "//third_party/js/react:node_modules",
    deps = [f":statuses_{build}" for build in _BUILDS.keys()],
)

js_test(
    name = "treeshake_test",
    srcs = ["treeshake.test.js"],
    data = [":rollup"] + [f":app_{build}" for build in _BUILDS.keys()],
)
