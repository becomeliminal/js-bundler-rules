import { hasCompilerRuntime } from "@test/compiled";
import { greet } from "@test/greeter";

export interface GreetingProps {
  /** Who is greeted. GREETING_PROP_DOC_MARKER */
  who: string;
  /** Shouted in capitals. */
  loud?: boolean;
}

/** A first-party library's output, rendered. */
export function Greeting({ who, loud = false }: GreetingProps) {
  const text = greet(who);
  return (
    <p className="greeting" data-compiled={String(hasCompilerRuntime)}>
      {loud ? text.toUpperCase() : text}
    </p>
  );
}
