import { renderToString } from "react-dom/server";
import { App } from "./App";

// The contract a host calls: give me markup. What the host is -- an express
// handler, a prerender script -- is the consumer's business, not the build's.
export function render(): string {
  return renderToString(<App />);
}
