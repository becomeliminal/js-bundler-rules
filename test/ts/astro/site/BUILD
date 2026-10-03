subinclude("//build_defs:bundler", "///js//build_defs:js")

# A static Astro site: a page rendering a first-party library by package name
# and importing its stylesheet, and a public/ file. astro_check gates it.
astro_build(
    name = "site",
    srcs = glob([
        "public/**/*",
        "src/**/*",
    ]),
    check = ":check",
    deps = ["//test/lib/greeter"],
    node_modules = "//third_party/js/astro:node_modules",
)

astro_check(
    name = "check",
    srcs = glob(["src/**/*"]),
    deps = ["//test/lib/greeter"],
    node_modules = "//third_party/js/astro:node_modules",
)

build_rule(
    name = "site_test",
    srcs = ["check_site.sh"],
    data = [":site"],
    outs = ["site_test"],
    cmd = "cp $SRCS $OUT",
    binary = True,
    test = True,
    no_test_output = True,
    test_cmd = "$TEST",
)

# The development server: `plz run //test/ts/astro/site:dev`, verified by
# verify_dev.sh, which needs a running server and so is not a plz test.
astro_dev(
    name = "dev",
    srcs = glob([
        "public/**/*",
        "src/**/*",
    ]),
    deps = ["//test/lib/greeter"],
    node_modules = "//third_party/js/astro:node_modules",
)
