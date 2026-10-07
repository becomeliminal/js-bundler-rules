# The build commands must parse in macOS's bash 3.2, not only Linux's bash 5.
build_rule(
    name = "bash32_test",
    srcs = ["check.sh"],
    data = ["//build_defs:bundler"],
    outs = ["bash32_test"],
    cmd = "cp $SRCS $OUT",
    binary = True,
    test = True,
    no_test_output = True,
    test_cmd = "$TEST",
)
