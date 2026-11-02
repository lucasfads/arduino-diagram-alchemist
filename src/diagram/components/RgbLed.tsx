import type { RenderProps } from "./registry";

const LEGS = [
  { name: "red", letter: "R", fill: "#e53935" },
  { name: "common", letter: "C", fill: "#37474f" },
  { name: "green", letter: "G", fill: "#43a047" },
  { name: "blue", letter: "B", fill: "#1e88e5" },
] as const;

/**
 * LED RGB 5 mm de 4 pernas, na ordem red, common, green, blue. A perna comum
 * (a mais longa) é o catodo (GND) ou o anodo (5V), conforme o modelo.
 * O corpo fica ao lado da fileira de pinos, na direção red → blue.
 */
export function RgbLed({ c, pins }: RenderProps) {
  if (LEGS.some((l) => !pins[l.name])) return null;
  const r = pins.red, b = pins.blue;
  const ang = Math.atan2(b.y - r.y, b.x - r.x);
  const dir = { x: Math.cos(ang), y: Math.sin(ang) };
  const nrm = { x: Math.sin(ang), y: -Math.cos(ang) }; // "para cima" quando red → blue é da esquerda p/ direita
  const all = LEGS.map((l) => pins[l.name]);
  const o = { x: all.reduce((s, p) => s + p.x, 0) / 4, y: all.reduce((s, p) => s + p.y, 0) / 4 };
  const at = (u: number, v: number) => ({ x: o.x + u * dir.x + v * nrm.x, y: o.y + u * dir.y + v * nrm.y });
  const along = (p: { x: number; y: number }) => (p.x - o.x) * dir.x + (p.y - o.y) * dir.y;

  const bodyV = 34, rad = 14;
  const body = at(0, bodyV);
  const legs = LEGS.map((l) => {
    const p = pins[l.name];
    const u = along(p);
    const eu = u * 0.4; // as pernas convergem para dentro do corpo
    const top = bodyV - rad + (l.name === "common" ? 5 : 1);
    const pts = [at(u, 0), at(u, 10), at(eu, 10), at(eu, top)];
    return { ...l, p, d: pts.map((q, i) => `${i ? "L" : "M"}${q.x},${q.y}`).join(" "), tag: at(u, 18) };
  });
  const t = c.label ?? c.id.toUpperCase();
  const w = t.length * 5.4 + 8;
  const ly = body.y - rad - 4;
  const dots = [at(-6, bodyV + 2), at(6, bodyV + 2), at(0, bodyV - 6)];
  return (
    <g data-component={c.id}>
      {legs.map((l) => (
        <path key={l.name} d={l.d} fill="none" stroke="#8a8f98" strokeWidth={1.6} strokeLinejoin="round" />
      ))}
      <circle cx={body.x} cy={body.y} r={rad} fill="#eceff1" stroke="#90a4ae" strokeWidth={1.5} />
      {[LEGS[0], LEGS[2], LEGS[3]].map((l, i) => (
        <circle key={l.name} cx={dots[i].x} cy={dots[i].y} r={3.6} fill={l.fill} />
      ))}
      <circle cx={body.x - 5} cy={body.y - 6} r={2.6} fill="#ffffff" opacity={0.75} />
      {legs.map((l) => (
        <circle key={l.name} cx={l.p.x} cy={l.p.y} r={2.4} fill="#555" />
      ))}
      {legs.map((l) => (
        <text key={l.name} x={l.tag.x} y={l.tag.y + 3} fontSize={9} fontWeight={700} fill={l.fill} textAnchor="middle" stroke="#ffffff" strokeWidth={2.4} paintOrder="stroke">
          {l.letter}
        </text>
      ))}
      <rect x={body.x - w / 2} y={ly - 9} width={w} height={12} rx={3} fill="#ffffff" opacity={0.92} stroke="#c8cdd4" strokeWidth={0.8} />
      <text x={body.x} y={ly} fontSize={9} fill="#333" textAnchor="middle" fontFamily="monospace">{t}</text>
    </g>
  );
}
