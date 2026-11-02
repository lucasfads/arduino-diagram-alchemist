import type { RenderProps } from "./registry";
import { Chip, PinDots, frame, path } from "./frame";

/** Sensor de luminosidade LDR (fotoresistor): disco cinza-azulado com filamento serpenteado vinho/roxo/vermelho; sem polaridade. */
export function Ldr({ c, pins }: RenderProps) {
  const a = pins.a, b = pins.b;
  if (!a || !b) return null;
  const { at, along, labelY } = frame([a, b]);
  const r = 14, bodyV = r + 14;
  const body = at(0, bodyV);
  const legs = [a, b].map((p) => {
    const u = along(p);
    return path([p, at(u, 8), at(u * 0.5, 8), at(u * 0.5, bodyV - r + 2)]);
  });
  const rows = [-9, -3, 3, 9];
  const serp = path(rows.flatMap((v, i) => (i % 2 === 0 ? [at(-8, bodyV + v), at(8, bodyV + v)] : [at(8, bodyV + v), at(-8, bodyV + v)])));
  const t = (c.label ?? c.id.toUpperCase()) + (c.value ? ` ${c.value}` : "");
  return (
    <g data-component={c.id}>
      {legs.map((d, i) => <path key={i} d={d} fill="none" stroke="#8a8f98" strokeWidth={1.6} strokeLinejoin="round" />)}
      <circle cx={body.x} cy={body.y} r={r} fill="#90a4ae" stroke="#546e7a" strokeWidth={1.5} />
      <circle cx={body.x} cy={body.y} r={r - 3} fill="none" stroke="#7b2d4f" strokeWidth={1.2} />
      <path d={serp} fill="none" stroke="#6a1b9a" strokeWidth={3} strokeLinejoin="round" strokeLinecap="round" />
      <path d={serp} fill="none" stroke="#d32f2f" strokeWidth={1.3} strokeLinejoin="round" strokeLinecap="round" strokeDasharray="5 3" />
      <circle cx={body.x - 6} cy={body.y - 8} r={2.2} fill="#ffffff" opacity={0.45} />
      <PinDots pts={[a, b]} />
      <Chip x={body.x} y={labelY(bodyV + r)} text={t} />
    </g>
  );
}
