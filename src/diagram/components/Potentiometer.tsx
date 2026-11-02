import type { RenderProps } from "./registry";
import { Chip, PinDots, box, frame, path } from "./frame";

const NAMES = ["vcc", "wiper", "gnd"] as const;
const TAGS = ["+", "W", "−"];

/**
 * Potenciômetro rotativo visto de frente e sempre em pé: base azul achatada embaixo, com as 3 pernas
 * (vcc, wiper, gnd) descendo até os furos, e um eixo cilíndrico longo e estriado (a parte que gira) no topo.
 */
export function Potentiometer({ c, pins }: RenderProps) {
  if (NAMES.some((n) => !pins[n])) return null;
  const pts = NAMES.map((n) => pins[n]);
  const { at, along, labelY } = frame(pts, true);
  const baseBottom = 12, baseTop = 26, collarTop = 30, shaftTop = 74, halfShaft = 8;
  const halfBase = Math.max(27, ...pts.map((p) => Math.abs(along(p)))) + 7;
  const t = (c.label ?? c.id.toUpperCase()) + (c.value ? ` ${c.value}` : "");
  const print = (c.value ?? "10k").replace(/[\u2126\u03a9\s]/g, "").toUpperCase();
  const printAt = at(0, (baseBottom + baseTop) / 2);
  return (
    <g data-component={c.id}>
      {pts.map((p, i) => (
        <path key={i} d={path([p, at(along(p), baseBottom + 1)])} fill="none" stroke="#8a8f98" strokeWidth={3.2} strokeLinecap="round" />
      ))}
      <path d={box(at, -halfShaft, collarTop - 1, halfShaft, shaftTop)} fill="#cfd8dc" stroke="#607d8b" strokeWidth={1.3} strokeLinejoin="round" />
      <path d={box(at, -halfShaft + 2.5, collarTop, -halfShaft + 5, shaftTop - 1)} fill="#ffffff" opacity={0.6} />
      {[-5, -2.5, 0, 2.5, 5].map((u) => (
        <path key={u} d={path([at(u, collarTop + 3), at(u, shaftTop - 4)])} stroke="#78909c" strokeWidth={0.9} />
      ))}
      <path d={box(at, -halfShaft - 2, shaftTop - 3, halfShaft + 2, shaftTop)} fill="#b0bec5" stroke="#607d8b" strokeWidth={1.1} strokeLinejoin="round" />
      <path d={box(at, -halfShaft - 3, baseTop, halfShaft + 3, collarTop)} fill="#90a4ae" stroke="#546e7a" strokeWidth={1.1} strokeLinejoin="round" />
      <path d={box(at, -halfBase, baseBottom, halfBase, baseTop)} fill="#1e5aa8" stroke="#0d3569" strokeWidth={1.5} strokeLinejoin="round" />
      <path d={box(at, -halfBase + 3, baseTop - 4, halfBase - 3, baseTop - 2)} fill="#ffffff" opacity={0.2} />
      <text x={printAt.x} y={printAt.y + 3} fontSize={8} fontWeight={700} fill="#ffffff" textAnchor="middle" fontFamily="monospace">{print}</text>
      <PinDots pts={pts} />
      {pts.map((p, i) => {
        const tag = at(along(p), 6);
        return (
          <text key={i} x={tag.x} y={tag.y + 3} fontSize={8} fontWeight={700} fill={i === 0 ? "#c62828" : "#222"} textAnchor="middle" stroke="#ffffff" strokeWidth={2.4} paintOrder="stroke">{TAGS[i]}</text>
        );
      })}
      <Chip x={at(0, 0).x} y={labelY(shaftTop)} text={t} />
    </g>
  );
}
