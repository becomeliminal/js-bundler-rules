subinclude("//build_defs:bundler", "///js//build_defs:js")

# The config requires ./banner.txt.js -- config_deps is what stages it, and
# the test asserts its content reached the output, so the staging is proven
# rather than incidental.
webpack_bundle(
    name = "bundle",
    srcs = ["entry.js"],
    config_deps = ["banner.txt.js"],
    deps = ["//test/lib/greeter"],
    node_modules = "//third_party/js/react:node_modules",
)

js_test(
    name = "bundle_test",
    srcs = ["check_webpack.test.js"],
    data = [":bundle"],
)
