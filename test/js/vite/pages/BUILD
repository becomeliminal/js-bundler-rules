subinclude("//build_defs:bundler", "///js//build_defs:js")

# Multi-page: several HTML entries through rollupOptions.input, again with no
# rule change. Outputs keep their page paths, so admin/index.html comes out at
# admin/index.html.
vite_bundle(
    name = "pages",
    srcs = glob([
        "index.html",
        "admin/index.html",
        "src/**/*",
    ]),
    config = "vite.config.js",
    deps = ["//test/lib/greeter"],
    node_modules = "//third_party/js/react:node_modules",
)

build_rule(
    name = "pages_test",
    srcs = ["check_pages.sh"],
    data = [":pages"],
    outs = ["pages_test"],
    cmd = "cp $SRCS $OUT",
    binary = True,
    test = True,
    no_test_output = True,
    test_cmd = "$TEST",
)
