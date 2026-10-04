subinclude("//build_defs:bundler", "///ts//build_defs:ts")

_SRCS = glob(
    [
        ".storybook/*",
        "public/**/*",
        "src/**/*",
    ],
    hidden = True,
) + [
    "tsconfig.json",
    "vite.config.ts",
]

# The stories, their config and the vite config, against the libraries'
# generated declarations.
ts_check(
    name = "typecheck",
    srcs = [s for s in _SRCS if s.endswith(".ts") or s.endswith(".tsx")],
    deps = [
        "//test/lib/compiled",
        "//test/lib/greeter",
    ],
    node_modules = "//third_party/js/react:node_modules",
    tsconfig_deps = ["//:tsconfig.json"],
)

storybook_build(
    name = "storybook",
    srcs = _SRCS,
    check = ":typecheck",
    config_deps = ["//:tsconfig.json"],
    node_modules = "//third_party/js/react:node_modules",
    deps = [
        "//test/lib/compiled",
        "//test/lib/greeter",
    ],
)

build_rule(
    name = "storybook_test",
    srcs = ["check_storybook.sh"],
    data = [":storybook"],
    outs = ["storybook_test"],
    cmd = "cp $SRCS $OUT",
    binary = True,
    test = True,
    no_test_output = True,
    test_cmd = "$TEST",
)

# Not a test, and cannot be: `plz run //test/ts/storybook:dev`, and
# verify_dev.sh scripts what a person would check.
storybook_dev(
    name = "dev",
    srcs = _SRCS,
    config_deps = ["//:tsconfig.json"],
    node_modules = "//third_party/js/react:node_modules",
    deps = [
        "//test/lib/compiled",
        "//test/lib/greeter",
    ],
)

# The stories in a browser: the static Storybook above, served, compared with
# the recorded snapshots under e2e/__snapshots__.
playwright_test(
    name = "stories_test",
    srcs = glob(["e2e/**"]),
    node_modules = "//third_party/js/react:node_modules",
    serve = ":storybook",
)

# Re-records those snapshots into the repository: `plz run`.
playwright_update(
    name = "stories_update",
    srcs = glob(["e2e/**"]),
    node_modules = "//third_party/js/react:node_modules",
    serve = ":storybook",
)

ts_check(
    name = "capture_typecheck",
    srcs = ["scripts/capture.ts"],
    tsconfig = "scripts/tsconfig.json",
    node_modules = "//third_party/js/react:node_modules",
    tsconfig_deps = ["//:tsconfig.json"],
)

# A program driving the pinned browser, run from this package so its relative
# arguments resolve here: `plz run //test/ts/storybook:capture -- \
#   ../../../plz-out/gen/test/ts/storybook/storybook-static greeting--loud /tmp/loud.png`
playwright_binary(
    name = "capture",
    main = "scripts/capture.ts",
    check = ":capture_typecheck",
    node_modules = "//third_party/js/react:node_modules",
)
