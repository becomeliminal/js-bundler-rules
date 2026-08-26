subinclude("//build_defs:bundler", "///js//build_defs:js")

rollup_bundle(
    name = "bundle",
    srcs = ["entry.js"],
    deps = ["//test/lib/greeter"],
    node_modules = "//third_party/js/react:node_modules",
)

js_test(
    name = "bundle_test",
    srcs = ["check_rollup.test.js"],
    data = [":bundle"],
)
