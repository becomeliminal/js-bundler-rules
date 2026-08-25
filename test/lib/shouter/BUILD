subinclude("///js//build_defs:js")

# Depends on another first-party library, so a bundle of this reaches two levels
# deep and the second level is never named by the bundle rule.
js_library(
    name = "shouter",
    package = "@test/shouter",
    srcs = ["index.js"],
    deps = ["//test/lib/greeter"],
    visibility = ["//test/..."],
)
