const { shout } = require("@test/shouter");

if (shout("please") !== "HELLO, PLEASE!") {
  throw new Error(`bundled the wrong thing: ${shout("please")}`);
}
console.log("ok");
