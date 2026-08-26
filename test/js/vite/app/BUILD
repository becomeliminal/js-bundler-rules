subinclude("//build_defs:bundler", "///js//build_defs:js")

# The same bundler, the same plugin, no TypeScript anywhere -- not in the
# sources, not in the config. check is absent rather than False because nothing
# here is TypeScript, so there is nothing for the rule to refuse.
vite_bundle(
    name = "app",
    srcs = glob([
        "index.html",
        "src/**/*",
    ]),
    config = "vite.config.js",
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
