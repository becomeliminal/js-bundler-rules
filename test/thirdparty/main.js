const ms = require("ms");
const { greet } = require("@test/greeter");

// One third-party package and one first-party library in the same bundle. If
// either is missing from the tree esbuild resolves through, this never builds.
const out = `${greet("please")} in ${ms(90000)}`;
if (out !== "Hello, please! in 2m") {
  throw new Error(`bundled the wrong thing: ${out}`);
}
console.log("ok");
