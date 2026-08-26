subinclude("//build_defs:bundler", "///js//build_defs:js", "///ts//build_defs:ts")

# A real React application. Three things happen here that esbuild_bundle cannot
# do: an index.html is the entry rather than a module, a config file is read and
# loads a plugin from the consumer's tree, and the output filenames are content
# hashed so none of them can be declared.
#
# check is not optional here, and the rule would refuse to parse without it.
# vite transpiles TypeScript with esbuild, which strips types without reading
# them, so the bundle depends on the check the way a go_binary depends on its
# code compiling.
vite_bundle(
    name = "app",
    srcs = glob([
        "index.html",
        "src/**/*",
    ]),
    check = ":typecheck",
    deps = ["//test/lib/greeter"],
    node_modules = "//third_party/js/react:node_modules",
)

# Checks the config as well as the sources. vite compiles vite.config.ts with
# esbuild too, so a type error in it is just as invisible -- which is why vite's
# own React template ships a second tsconfig covering exactly that file.
#
# It checks against //test/lib/greeter's *generated declarations*, not its
# sources, so this exercises the whole stack rather than just the compiler:
# node-rules pins the runtime, js-rules assembles the tree, ts-rules emits the
# .d.ts, and vite_bundle ships the result.
ts_check(
    name = "typecheck",
    srcs = ["vite.config.ts"] + glob([
        "src/**/*.ts",
        "src/**/*.tsx",
    ]),
    deps = ["//test/lib/greeter"],
    node_modules = "//third_party/js/react:node_modules",
    tsconfig_deps = ["//:tsconfig.json"],
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

# Vitest is vite: the same config file, the same plugin pipeline, the same
# transform. A component tested here is transformed exactly as it will be
# bundled -- which is why this shares vite_bundle's config rather than having
# one of its own.
vitest_test(
    name = "unit_test",
    srcs = [
        "src/App.test.tsx",
        "src/data.ts",
    ],
    node_modules = "//third_party/js/react:node_modules",
)
