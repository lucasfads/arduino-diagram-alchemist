import type { RenderProps } from "./registry";
import { Chip, PinDots, frame, path } from "./frame";

/** Buzzer (~12 mm, ocupa ~4–5 colunas): cilindro preto com anéis e furo central; a perna positiva (+) fica marcada. */
export function Buzzer({ c, pins }: RenderProps) {
  const p = pins.positive, n = pins.negative;
  if (!p || !n) return null;
  const { at, along, labelY } = frame([p, n]);
  const r = 34, bodyV = r + 14;
  const body = at(0, bodyV);
  const legs = [p, n].map((q) => {
    const u = along(q);
    return path([q, at(u, bodyV - Math.sqrt(Math.max(0, r * r - u * u)) + 2)]);
  });
  const side = along(p) < 0 ? -1 : 1;
  const plus = at(side * r * 0.62, bodyV);
  const plusLeg = at(along(p) + side * 9, 12);
  const t = c.label ?? c.id.toUpperCase();
  return (
    <g data-component={c.id}>
      {legs.map((d, i) => <path key={i} d={d} fill="none" stroke="#8a8f98" strokeWidth={1.6} strokeLinejoin="round" />)}
      <circle cx={body.x} cy={body.y} r={r} fill="#212121" stroke="#000000" strokeWidth={1.6} />
      <circle cx={body.x} cy={body.y} r={r - 4} fill="none" stroke="#3a3a3a" strokeWidth={1} />
      <circle cx={body.x} cy={body.y} r={r - 10} fill="none" stroke="#424242" strokeWidth={0.9} />
      <circle cx={body.x} cy={body.y} r={r * 0.5} fill="none" stroke="#2f2f2f" strokeWidth={0.9} />
      <circle cx={body.x} cy={body.y} r={6} fill="#555555" stroke="#9e9e9e" strokeWidth={1} />
      <circle cx={body.x - r * 0.45} cy={body.y - r * 0.5} r={4} fill="#ffffff" opacity={0.12} />
      <text x={plus.x} y={plus.y + 5} fontSize={13} fontWeight={700} fill="#e0e0e0" textAnchor="middle">+</text>
      <PinDots pts={[p, n]} />
      <text x={plusLeg.x} y={plusLeg.y + 3} fontSize={10} fontWeight={700} fill="#c62828" textAnchor="middle" stroke="#ffffff" strokeWidth={2.4} paintOrder="stroke">+</text>
      <Chip x={body.x} y={labelY(bodyV + r)} text={t} />
    </g>
  );
}
