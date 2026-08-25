subinclude("//build_defs:bundler", "///js//build_defs:js", "///ts//build_defs:ts")

# A real React application. Three things happen here that esbuild_bundle cannot
# do: an index.html is the entry rather than a module, a config file is read and
# loads a plugin from the consumer's tree, and the output filenames are content
# hashed so none of them can be declared.
vite_bundle(
    name = "app",
    srcs = [
        "index.html",
        "src/App.tsx",
        "src/data.ts",
        "src/main.tsx",
        "src/styles.css",
    ],
    deps = ["//test/lib/greeter"],
    node_modules = "//third_party/js/react:node_modules",
)

build_rule(
    name = "app_test",
    srcs = ["check_app.sh"],
    data = [":app"],
    outs = ["app_test"],
    cmd = "cp $SRCS $OUT",
    binary = True,
    test = True,
    no_test_output = True,
    test_cmd = "$TEST",
)


# The target that makes ts-rules worth having here. vite transpiles TypeScript
# with esbuild, which strips types without reading them -- so without this, a
# type error in a component reaches the bundle having failed no build.
#
# It checks against //test/lib/greeter's *generated declarations*, not its
# sources, so this is a test of the whole stack and not just of the compiler:
# node-rules pins the runtime, js-rules assembles the tree, ts-rules emits the
# .d.ts, and vite_bundle ships the result.
ts_check(
    name = "typecheck",
    srcs = [
        "src/App.tsx",
        "src/data.ts",
        "src/main.tsx",
        "src/vite-env.d.ts",
    ],
    deps = ["//test/lib/greeter"],
    node_modules = "//third_party/js/react:node_modules",
    tsconfig_deps = ["//:tsconfig.json"],
)
