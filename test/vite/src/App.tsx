import { useState } from "react";
import { greet } from "@test/greeter";
import { ROWS, VERDICTS, type Row } from "./data";

const MEASURES = [
  { key: "defs" as const, label: "build_defs / starlark" },
  { key: "go" as const, label: "companion tool (Go)" },
  { key: "rules" as const, label: "public rules" },
  { key: "tests" as const, label: "test targets" },
];

function Bar({ row, metric, max }: { row: Row; metric: keyof Row; max: number }) {
  const value = row[metric] as number;
  const pct = max === 0 ? 0 : Math.max(value === 0 ? 0 : 1.5, (value / max) * 100);
  return (
    <div className="bar">
      <span className="bar__label">{row.stack}</span>
      <span className="bar__track">
        <span
          className={row.stack === "this stack" ? "bar__fill bar__fill--us" : "bar__fill"}
          style={{ width: `${pct}%` }}
        />
      </span>
      <span className="bar__value">{value.toLocaleString()}</span>
    </div>
  );
}

export function App() {
  const [metric, setMetric] = useState<keyof Row>("defs");
  const max = Math.max(...ROWS.map((r) => r[metric] as number));

  return (
    <main className="sheet">
      <header>
        <p className="eyebrow">js-bundler-rules · //test/vite · built by vite_bundle</p>
        <h1>Smaller, and not finished</h1>
        <p className="standfirst">
          Four Please plugins against Aspect's Bazel stack and against the single repo
          this replaced. Every number was counted, not estimated. This page is a React
          application bundled by the rule it describes — the greeting below comes from a
          first-party library resolved by package name through a tree Please assembled.
        </p>
        <p className="greeting">{greet("Please")}</p>
      </header>

      <section>
        <h2>Counted</h2>
        <div className="toggle" role="group" aria-label="measure">
          {MEASURES.map((m) => (
            <button
              key={m.key}
              className={metric === m.key ? "toggle__btn toggle__btn--on" : "toggle__btn"}
              aria-pressed={metric === m.key}
              onClick={() => setMetric(m.key)}
            >
              {m.label}
            </button>
          ))}
        </div>
        <div className="bars">
          {ROWS.map((r) => (
            <Bar key={r.stack} row={r} metric={metric} max={max} />
          ))}
        </div>
        <dl className="notes">
          {ROWS.map((r) => (
            <div key={r.stack}>
              <dt>{r.stack}</dt>
              <dd>{r.note}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section>
        <h2>The honest ledger</h2>
        <div className="verdicts">
          {VERDICTS.map((v) => (
            <article key={v.claim} className={`verdict verdict--${v.kind}`}>
              <h3>{v.claim}</h3>
              <p>{v.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <footer>
        vite 7.1.2 · react 19.1.1 · @vitejs/plugin-react 5.0.0 · 115 packages in the
        lockfile, one React · content-hashed output, byte-identical across a clean rebuild
      </footer>
    </main>
  );
}
