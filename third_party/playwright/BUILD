subinclude("//build_defs:bundler")

# The Chromium playwright_test runs in: Chrome for Testing's headless shell,
# the build Playwright 1.63.0 itself installs (playwright-core's browsers.json:
# chromium-headless-shell, revision 1243, Chrome 153.0.8010.12). A hash-pinned
# download per platform, so no test ever fetches a browser at run time.
#
# Bumping Playwright: take the new revision and browserVersion from
# playwright-core/browsers.json, then each platform's hash with
# `curl -sL <url> | sha256sum` for the URLs playwright_browser builds.
# playwright_test refuses to run while the two disagree.
playwright_browser(
    name = "chromium_headless_shell",
    browser_version = "153.0.8010.12",
    hashes = {
        "darwin_amd64": "5c2eaa1aad62111bb5a70dd0889dd3093f3142277b8f78957a238257ee85f009",
        "darwin_arm64": "89d80a6d26ccd0ccfd51e22d9e1297283862af2b0cd91dce07459b35ca0059f2",
        "linux_amd64": "a9da028861a0cf789ff25c2fed45f5f1aaf969ed9247835b6a7821a4f7af9d1d",
        "linux_arm64": "d433c45172c7836e38124fe545f767b02210bfb43a6262f08a297473a8e91c99",
    },
    revision = "1243",
    visibility = ["PUBLIC"],
)
