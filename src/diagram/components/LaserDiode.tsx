import type { RenderProps } from "./registry";
import { Chip, rounded } from "./frame";

const NAMES = ["positive", "negative"] as const;
const WIRE = { positive: "#e53935", negative: "#1e63d6" } as const;

const TOP = 22;
const H = 46;
const W = 16;
const WIRE_LANE0 = 118;
const WIRE_LANE = 7;
const laserX = (index: number) => 620 - index * 60;

/**
 * Diodo laser: cilindro de cobre/ouro desenhado fora da placa, na faixa superior do diagrama,
 * com dois fios (vermelho = +, azul = −) que vão até os furos da protoboard ou pinos do Arduino.
 */
export function LaserDiode({ c, pins, index }: RenderProps) {
  if (NAMES.some((n) => !pins[n])) return null;
  const x0 = laserX(index);
  const bottom = TOP + H;
  const center = x0 + W / 2;
  const byX = [...NAMES].sort((a, b) => pins[a].x - pins[b].x || NAMES.indexOf(a) - NAMES.indexOf(b));
  const lanes = [...NAMES].sort((a, b) => Math.abs(pins[b].x - center) - Math.abs(pins[a].x - center) || NAMES.indexOf(a) - NAMES.indexOf(b));
  const t = c.label ?? c.id.toUpperCase();
  return (
    <g data-component={c.id}>
      <path d={`M${x0 + 3},${TOP} L${x0 + W - 3},${TOP} L${x0 + W + 4},${TOP - 14} L${x0 - 4},${TOP - 14} Z`} fill="#ff1744" opacity={0.2} />
      {byX.map((n, i) => {
        const x = x0 + 4 + i * 8;
        const e = pins[n];
        const lane = WIRE_LANE0 + lanes.indexOf(n) * WIRE_LANE;
        const corners = [{ x, y: bottom }, { x, y: lane }, { x: e.x, y: lane }, e];
        const d = rounded(corners.filter((p, k) => k === 0 || p.x !== corners[k - 1].x || p.y !== corners[k - 1].y));
        return (
          <g key={n} data-laser-wire={n}>
            <path d={d} fill="none" stroke="#ffffff" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
            <path d={d} fill="none" stroke={WIRE[n]} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
            <circle cx={e.x} cy={e.y} r={3.6} fill={WIRE[n]} stroke="#ffffff" strokeWidth={1} />
          </g>
        );
      })}
      <rect x={x0} y={TOP} width={W} height={H} rx={3} fill="#c98a3b" stroke="#7a4a12" strokeWidth={1.3} />
      <rect x={x0 + 2.5} y={TOP + 2} width={3.5} height={H - 4} rx={1.5} fill="#f3cf86" opacity={0.85} />
      <rect x={x0 - 1} y={TOP + 8} width={W + 2} height={2} fill="#7a4a12" opacity={0.7} />
      <rect x={x0 - 1} y={TOP + H - 10} width={W + 2} height={2} fill="#7a4a12" opacity={0.7} />
      <ellipse cx={center} cy={TOP} rx={W / 2 - 2} ry={2.2} fill="#ffcdd2" stroke="#b71c1c" strokeWidth={0.8} />
      <Chip x={center} y={TOP + H / 2 + 3} text={t} />
    </g>
  );
}
