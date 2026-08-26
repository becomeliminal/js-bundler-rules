subinclude("//build_defs:bundler", "///js//build_defs:js", "///ts//build_defs:ts")

# Server-side rendering: build.ssr in the config, no rule change. This is the
# half the landing page is gated on -- a React tree rendered to markup by
# node, with no browser anywhere.
vite_bundle(
    name = "ssr",
    srcs = glob(["src/**/*"]),
    check = ":typecheck",
    deps = ["//test/lib/greeter"],
    node_modules = "//third_party/js/react:node_modules",
)

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

# Not a grep: the test imports the server bundle and calls render(). Markup
# coming back is the whole claim.
js_test(
    name = "ssr_test",
    srcs = ["check_ssr.test.js"],
    data = [":ssr"],
)
