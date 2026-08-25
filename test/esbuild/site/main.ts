// The entry esbuild starts from. TypeScript with no compiler in sight: esbuild
// strips the types itself, which is why this bundles without ts-rules.
//
// Every visible element is rendered from data imported by package name from a
// separate first-party library. Nothing here is written into the HTML, so if
// the bundle failed to resolve @stack/layers the page is blank -- the page is
// its own falsification test.
import { LAYERS, FACTS, type Layer, type Fact } from "@stack/layers";
import "./styles.css";

const el = (tag: string, cls?: string, text?: string): HTMLElement => {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (text !== undefined) node.textContent = text;
  return node;
};

function strata(into: HTMLElement): void {
  const wrap = el("div", "strata");
  (LAYERS as Layer[]).forEach((layer, i) => {
    const top = i === LAYERS.length - 1;
    const row = el("div", top ? "layer layer--top" : "layer");
    row.appendChild(el("div", "layer__n", `L${layer.n}`));

    const mid = el("div");
    mid.appendChild(el("p", "layer__repo", layer.repo));
    mid.appendChild(el("p", "layer__role", layer.role));
    row.appendChild(mid);

    row.appendChild(el("div", "layer__rule", layer.rule));
    wrap.appendChild(row);

    if (!top) {
      const hands = el("div", "hands");
      hands.appendChild(el("span", undefined, `hands up ${layer.hands}`));
      wrap.appendChild(hands);
    }
  });
  into.appendChild(wrap);
}

function facts(into: HTMLElement): void {
  const wrap = el("div", "facts");
  (FACTS as Fact[]).forEach((fact) => {
    const row = el("div", "fact");
    row.appendChild(el("span", "fact__k", fact.k));
    row.appendChild(el("span", "fact__v", fact.v));
    if (fact.note) row.appendChild(el("span", "fact__note", fact.note));
    wrap.appendChild(row);
  });
  into.appendChild(wrap);
}

function proof(into: HTMLElement): void {
  const box = el("div", "proof");
  const out = el("output", "proof__out", "—");
  const button = el("button", undefined, "run the bundled code");
  let n = 0;
  button.addEventListener("click", () => {
    n += 1;
    const names = (LAYERS as Layer[]).map((l) => l.repo).join(" → ");
    out.textContent = `${names}  (${n})`;
  });
  box.appendChild(out);
  box.appendChild(button);
  into.appendChild(box);
}

const mount = (id: string, render: (into: HTMLElement) => void): void => {
  const host = document.getElementById(id);
  if (host) render(host);
};

mount("strata", strata);
mount("facts", facts);
mount("proof", proof);
