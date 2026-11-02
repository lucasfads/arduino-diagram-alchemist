import type { RenderProps } from "./registry";
import { Chip, rounded } from "./frame";

const NAMES = ["signal", "vcc", "gnd"] as const;
const WIRE = { signal: "#ef6c00", vcc: "#e53935", gnd: "#6d4c41" } as const;

const SERVO_TOP = 38;
const SERVO_H = 36;
const SERVO_W = 90;
const WIRE_LANE0 = 92;
const WIRE_LANE = 7;
const servoX = (index: number) => 770 - index * 150;

/**
 * Micro servo 9g desenhado fora da placa, na faixa superior do diagrama. Os 3 fios
 * (laranja = sinal, vermelho = vcc, marrom = gnd) saem do corpo e vão até os pinos
 * informados — furos da protoboard (ex.: "T+3") ou pinos do Arduino (ex.: "arduino:D9").
 */
export function MicroServo({ c, pins, index }: RenderProps) {
  if (NAMES.some((n) => !pins[n])) return null;
  const sx = servoX(index);
  const bottom = SERVO_TOP + SERVO_H;
  const byX = [...NAMES].sort((a, b) => pins[a].x - pins[b].x || NAMES.indexOf(a) - NAMES.indexOf(b));
  const center = sx + SERVO_W / 2;
  const lanes = [...NAMES].sort((a, b) => Math.abs(pins[b].x - center) - Math.abs(pins[a].x - center) || NAMES.indexOf(a) - NAMES.indexOf(b));
  const gx = sx + 64, gy = SERVO_TOP + SERVO_H / 2;
  const t = c.label ?? c.id.toUpperCase();
  return (
    <g data-component={c.id}>
      {byX.map((n, i) => {
        const x = sx + 12 + i * 10;
        const e = pins[n];
        const lane = WIRE_LANE0 + lanes.indexOf(n) * WIRE_LANE;
        const corners = [{ x, y: bottom }, { x, y: lane }, { x: e.x, y: lane }, e];
        const d = rounded(corners.filter((p, k) => k === 0 || p.x !== corners[k - 1].x || p.y !== corners[k - 1].y));
        return (
          <g key={n} data-servo-wire={n}>
            <path d={d} fill="none" stroke="#ffffff" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
            <path d={d} fill="none" stroke={WIRE[n]} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
            <circle cx={e.x} cy={e.y} r={3.6} fill={WIRE[n]} stroke="#ffffff" strokeWidth={1} />
          </g>
        );
      })}
      <rect x={sx - 12} y={gy - 4} width={SERVO_W + 24} height={8} rx={2} fill="#1565c0" stroke="#0d3569" strokeWidth={1.2} />
      {[sx - 7, sx + SERVO_W + 7].map((x) => <circle key={x} cx={x} cy={gy} r={1.8} fill="#ffffff" />)}
      <rect x={sx} y={SERVO_TOP} width={SERVO_W} height={SERVO_H} rx={3} fill="#1e88e5" stroke="#0d3569" strokeWidth={1.4} />
      <rect x={sx + 4} y={SERVO_TOP + 4} width={36} height={SERVO_H - 8} rx={2} fill="#1976d2" opacity={0.7} />
      <text x={sx + 22} y={gy + 3} fontSize={9} fontWeight={700} fill="#ffffff" textAnchor="middle" fontFamily="monospace">SG90</text>
      <circle cx={gx} cy={gy} r={12} fill="#1565c0" stroke="#0d3569" strokeWidth={1.2} />
      <rect x={gx - 4} y={gy - 4} width={30} height={8} rx={4} fill="#eceff1" stroke="#78909c" strokeWidth={1.2} />
      <circle cx={gx} cy={gy} r={4.5} fill="#cfd8dc" stroke="#78909c" strokeWidth={1.2} />
      <circle cx={gx} cy={gy} r={1.5} fill="#455a64" />
      <Chip x={sx + SERVO_W / 2} y={SERVO_TOP - 5} text={t} />
    </g>
  );
}
