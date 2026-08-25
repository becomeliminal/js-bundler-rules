const { greet } = require("@test/greeter");

exports.shout = (who) => greet(who).toUpperCase();
