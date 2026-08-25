subinclude("//build_defs:bundler", "///js//build_defs:js")

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
    deps = ["//test/bundle/lib/greeter"],
    node_modules = "//third_party/js/app:node_modules",
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

