import { useState } from "react";
import { HashRouter, Routes, Route, NavLink, useParams, Navigate } from "react-router";
import { greet } from "@test/greeter";
import { ROWS, VERDICTS, type Row } from "./data";

const MEASURES = [
  { key: "defs" as const, label: "build_defs / starlark" },
  { key: "go" as const, label: "companion tool (Go)" },
  { key: "rules" as const, label: "public rules" },
  { key: "tests" as const, label: "test targets" },
];

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-");

function Bar({ row, metric, max }: { row: Row; metric: keyof Row; max: number }) {
  const value = row[metric] as number;
  const pct = max === 0 ? 0 : Math.max(value === 0 ? 0 : 1.5, (value / max) * 100);
  return (
    <div className="bar">
      <NavLink className="bar__label" to={`/stack/${slug(row.stack)}`}>
        {row.stack}
      </NavLink>
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

function Counted() {
  const [metric, setMetric] = useState<keyof Row>("defs");
  const max = Math.max(...ROWS.map((r) => r[metric] as number));
  return (
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
      <p className="hint">Each name is a route. Click one.</p>
    </section>
  );
}

function Ledger() {
  return (
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
  );
}

// A dynamic segment, which is the part of routing a static page cannot fake:
// the parameter is read from the URL at render time.
function Stack() {
  const { name } = useParams();
  const row = ROWS.find((r) => slug(r.stack) === name);
  if (!row) return <Navigate to="/" replace />;
  return (
    <section>
      <h2>{row.stack}</h2>
      <p className="prose">{row.note}</p>
      <div className="facts">
        {MEASURES.map((m) => (
          <div className="fact" key={m.key}>
            <span className="fact__k">{m.label}</span>
            <span className="fact__v">{(row[m.key] as number).toLocaleString()}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export function App() {
  return (
    <HashRouter>
      <main className="sheet">
        <header>
          <p className="eyebrow">js-bundler-rules · //test/vite · built by vite_bundle</p>
          <h1>Smaller, and not finished</h1>
          <p className="standfirst">
            Four Please plugins against Aspect's Bazel stack and against the single repo
            this replaced. Every number was counted, not estimated. This is a React
            application with client-side routing, bundled by the rule it describes — the
            greeting below comes from a first-party library resolved by package name
            through a tree Please assembled.
          </p>
          <p className="greeting">{greet("Please")}</p>
          <nav className="nav">
            <NavLink to="/" end>counted</NavLink>
            <NavLink to="/ledger">ledger</NavLink>
          </nav>
        </header>

        <Routes>
          <Route path="/" element={<Counted />} />
          <Route path="/ledger" element={<Ledger />} />
          <Route path="/stack/:name" element={<Stack />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <footer>
          vite 7.1.2 · react 19.1.1 · react-router 7.9.1 · 118 packages in the lockfile,
          one React · content-hashed output, byte-identical across a clean rebuild
        </footer>
      </main>
    </HashRouter>
  );
}
