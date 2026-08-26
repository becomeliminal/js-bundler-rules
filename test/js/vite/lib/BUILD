subinclude("//build_defs:bundler", "///js//build_defs:js")

# Library mode: build.lib in the config, nothing new in the rule. The rule
# passes the config through on purpose, so the work here was declaring what
# comes out -- fileName makes that predictable where an app build is hashed.
vite_bundle(
    name = "lib",
    srcs = glob(["src/**/*"]),
    config = "vite.config.js",
    deps = ["//test/lib/greeter"],
    node_modules = "//third_party/js/react:node_modules",
)

# The ticket's bar: importable by a running program, in both formats vite
# emitted, with the first-party dependency answering from inside the bundle.
js_test(
    name = "lib_test",
    srcs = ["check_lib.test.js"],
    data = [":lib"],
)
