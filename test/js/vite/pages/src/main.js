import { greet } from "@test/greeter";
document.getElementById("root").textContent = `page:main ${greet("visitor")}`;
