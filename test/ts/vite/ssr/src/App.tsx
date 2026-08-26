import { greet } from "@test/greeter";

// The same component shape the client fixtures render into a DOM. Here nothing
// provides a DOM, which is the point: server rendering succeeds only if the
// whole tree evaluates without one.
export function App() {
  return (
    <main>
      <h1>{greet("server")}</h1>
      <p data-rendered="ssr">rendered without a browser</p>
    </main>
  );
}
