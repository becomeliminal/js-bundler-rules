import { useState } from "react";
import { greet } from "@test/greeter";

// JSX in a .jsx file, which is what a React app looked like before TypeScript
// and what a great many still look like. @vitejs/plugin-react has to transform
// it exactly as it does .tsx, and nothing here declares a single type.
export function App() {
  const [n, setN] = useState(0);
  return (
    <main>
      <h1>{greet("Please")}</h1>
      <button onClick={() => setN(n + 1)}>clicked {n}</button>
    </main>
  );
}
