import type { RenderProps } from "./registry";
import { Chip, PinDots, box, frame, path } from "./frame";

const NAMES = ["vcc", "gnd", "signal"] as const;
const TAGS = ["VCC", "GND", "DO"];

/** Módulo sensor de vibração/tilt SW-420: plaquinha azul com 3 pernas (VCC, GND, DO), trimpot, sensor e LED. */
export function TiltSensor({ c, pins }: RenderProps) {
  if (NAMES.some((n) => !pins[n])) return null;
  const pts = NAMES.map((n) => pins[n]);
  const { at, along, labelY } = frame(pts, true);
  const lo = 6, hi = 54;
  const hw = Math.max(20, ...pts.map((p) => Math.abs(along(p)))) + 8;
  const t = c.label ?? c.id.toUpperCase();
  const pt = (u: number, v: number) => ({ x: at(u, v).x, y: at(u, v).y });
  const trim = pt(hw - 13, 38), led = pt(-hw + 8, 46), sens = pt(-hw + 14, 28);
  return (
    <g data-component={c.id}>
      {pts.map((p, i) => (
        <path key={i} d={path([p, at(along(p), lo)])} fill="none" stroke="#8a8f98" strokeWidth={3.2} strokeLinecap="round" />
      ))}
      <path d={box(at, -hw, lo, hw, hi)} fill="#1e4fa3" stroke="#0d2b66" strokeWidth={1.4} strokeLinejoin="round" />
      {[[-hw + 4, hi - 4], [hw - 4, hi - 4]].map(([u, v], i) => <circle key={i} cx={pt(u, v).x} cy={pt(u, v).y} r={1.8} fill="#e3f2fd" />)}
      <path d={box(at, -hw + 6, 14, -hw + 22, 20)} fill="#222" stroke="#000" strokeWidth={0.8} />
      <circle cx={sens.x} cy={sens.y} r={7} fill="#2b2b2b" stroke="#000" strokeWidth={1} />
      <circle cx={sens.x} cy={sens.y} r={3} fill="#d4af37" stroke="#9c7a1e" strokeWidth={0.8} />
      <rect x={trim.x - 8} y={trim.y - 8} width={16} height={16} rx={2} fill="#1565c0" stroke="#0a3d7a" strokeWidth={1} />
      <circle cx={trim.x} cy={trim.y} r={5} fill="#eceff1" stroke="#78909c" strokeWidth={0.8} />
      <line x1={trim.x - 3.5} y1={trim.y} x2={trim.x + 3.5} y2={trim.y} stroke="#546e7a" strokeWidth={1.2} />
      <circle cx={led.x} cy={led.y} r={2.6} fill="#ff1744" stroke="#7f0000" strokeWidth={0.6} />
      <PinDots pts={pts} />
      {pts.map((p, i) => {
        const tag = at(along(p), 11);
        return <text key={i} x={tag.x} y={tag.y + 2.5} fontSize={6.5} fontWeight={700} fill="#ffffff" textAnchor="middle" fontFamily="monospace">{TAGS[i]}</text>;
      })}
      <Chip x={at(0, 0).x} y={labelY(hi + 2)} text={t} />
    </g>
  );
}
