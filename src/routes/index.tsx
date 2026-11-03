import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { Diagram } from "@/diagram/Diagram";
import { validate } from "@/diagram/validate";
import { exportPng, exportSvg, slug } from "@/diagram/export";
import type { DiagramSpec } from "@/diagram/types";
import pisca from "../../examples/pisca-pisca.json";
import semaforo from "../../examples/semaforo.json";
import botaoRgb from "../../examples/botao-rgb.json";
import sensores from "../../examples/sensores.json";
import servo from "../../examples/servo.json";
import laserTiltDisplay from "../../examples/laser-tilt-display.json";

const EXAMPLES: Record<string, unknown> = { "Pisca-pisca": pisca, "Semáforo": semaforo, "Botão + LED RGB": botaoRgb, "Potenciômetro, LDR e buzzer": sensores, "Servo 9g": servo, "Laser, tilt e display": laserTiltDisplay };

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Gerador de diagramas Arduino — JSON para SVG" },
      { name: "description", content: "Descreva uma montagem com Arduino Uno e protoboard em JSON e exporte um diagrama vetorial SVG ou PNG." },
      { property: "og:title", content: "Gerador de diagramas Arduino" },
      { property: "og:description", content: "Montagens Arduino Uno + protoboard 400 pontos, de JSON para SVG/PNG." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [text, setText] = useState(() => JSON.stringify(pisca, null, 2));
  const svgRef = useRef<SVGSVGElement>(null);

  const state = useMemo(() => {
    try {
      const spec = JSON.parse(text) as DiagramSpec;
      spec.components ??= [];
      spec.jumpers ??= [];
      return { spec, ...validate(spec) };
    } catch (e) {
      return { parseError: (e as Error).message };
    }
  }, [text]);

  const [last, setLast] = useState(state);
  if ("spec" in state && state !== last) setLast(state);
  const shown = "spec" in state ? state : "spec" in last ? last : null;
  const name = slug(shown?.spec.title);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-4 px-6 py-4">
          <div>
            <h1 className="font-mono text-lg font-semibold tracking-tight">uno/diagram</h1>
            <p className="text-sm text-muted-foreground">JSON → SVG para Arduino Uno R3 + protoboard 400 pontos</p>
          </div>
          <div className="flex gap-2">
            <button className="btn-ghost" disabled={!shown} onClick={() => svgRef.current && exportSvg(svgRef.current, name)}>Exportar SVG</button>
            <button className="btn-primary" disabled={!shown} onClick={() => svgRef.current && exportPng(svgRef.current, name)}>Exportar PNG</button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1500px] gap-6 px-6 py-6 lg:grid-cols-[420px_1fr]">
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="label">Montagem (JSON)</span>
            <select className="select" defaultValue="" onChange={(e) => e.target.value && setText(JSON.stringify(EXAMPLES[e.target.value], null, 2))}>
              <option value="" disabled>Carregar exemplo…</option>
              {Object.keys(EXAMPLES).map((k) => <option key={k}>{k}</option>)}
            </select>
          </div>
          <textarea className="editor" spellCheck={false} value={text} onChange={(e) => setText(e.target.value)} />
          <div className="panel">
            <span className="label">Validação</span>
            <ul className="mt-2 space-y-1 font-mono text-xs">
              {"parseError" in state && <li className="text-destructive">JSON inválido: {state.parseError}</li>}
              {"issues" in state && state.issues.length === 0 && <li className="text-success">✓ Nenhum problema encontrado</li>}
              {"issues" in state && state.issues.map((i, k) => (
                <li key={k} className={i.level === "error" ? "text-destructive" : "text-warning"}>
                  {i.level === "error" ? "✗" : "!"} {i.message}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <span className="label">Prévia</span>
          <div className="preview">
            {shown && <Diagram ref={svgRef} spec={shown.spec} resolved={shown.resolved} />}
          </div>
        </section>
      </div>
    </main>
  );
}
