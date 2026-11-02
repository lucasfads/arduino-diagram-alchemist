import type { RenderProps } from "./registry";

const LED_COLORS: Record<string, [string, string]> = {
  red: ["#e53935", "#b71c1c"],
  green: ["#43a047", "#1b5e20"],
  yellow: ["#fdd835", "#c6a700"],
  blue: ["#1e88e5", "#0d47a1"],
  white: ["#f5f5f5", "#9e9e9e"],
  orange: ["#fb8c00", "#e65100"],
};

/** LED 5 mm: perna longa (anodo, +) dobrada; lado chato do corpo no catodo. */
export function Led({ c, pins }: RenderProps) {
  const a = pins.anode, k = pins.cathode;
  if (!a || !k) return null;
  const [fill, stroke] = LED_COLORS[c.color ?? "red"] ?? LED_COLORS.red;
  const mx = (a.x + k.x) / 2, my = (a.y + k.y) / 2;
  const vertical = Math.abs(a.x - k.x) < Math.abs(a.y - k.y);
  // corpo deslocado perpendicularmente ao par de furos
  const bx = vertical ? mx - 22 : mx, by = vertical ? my : my - 24;
  const r = 9;
  const legEnd = (p: { x: number; y: number }, sign: number) =>
    vertical ? { x: bx + r - 2, y: by + sign * 4 } : { x: bx + sign * 4, y: by + r - 2 };
  const sa = vertical ? Math.sign(a.y - k.y) : Math.sign(a.x - k.x);
  const ea = legEnd(a, sa), ek = legEnd(k, -sa);
  const lbl = (p: { x: number; y: number }, t: string, s: number) =>
    vertical ? { x: p.x + 9, y: p.y + s * 2 + 3, t } : { x: p.x + s * 8, y: p.y - 5, t };
  const la = lbl(a, "+", sa), lk = lbl(k, "−", -sa);
  // perna do anodo com dobra (mais longa)
  const anodePath = vertical
    ? `M${a.x},${a.y} H${(a.x + ea.x) / 2 + 3} V${ea.y} H${ea.x}`
    : `M${a.x},${a.y} V${(a.y + ea.y) / 2 + 3} H${ea.x} V${ea.y}`;
  const cathodePath = vertical ? `M${k.x},${k.y} H${ek.x} V${ek.y}` : `M${k.x},${k.y} V${(k.y + ek.y) / 2} H${ek.x} V${ek.y}`;
  const flat = vertical
    ? { x1: bx - r, y1: by - sa * r * 0.95, x2: bx + r, y2: by - sa * r * 0.95 }
    : { x1: bx - sa * r * 0.95, y1: by - r, x2: bx - sa * r * 0.95, y2: by + r };
  return (
    <g data-component={c.id}>
      <path d={anodePath} fill="none" stroke="#8a8f98" strokeWidth={1.6} strokeLinejoin="round" />
      <path d={cathodePath} fill="none" stroke="#8a8f98" strokeWidth={1.6} strokeLinejoin="round" />
      <circle cx={bx} cy={by} r={r} fill={fill} stroke={stroke} strokeWidth={1.5} />
      <circle cx={bx - 3} cy={by - 3} r={2.5} fill="#ffffff" opacity={0.6} />
      <line {...flat} stroke={stroke} strokeWidth={2.4} />
      <circle cx={a.x} cy={a.y} r={2.4} fill="#555" />
      <circle cx={k.x} cy={k.y} r={2.4} fill="#555" />
      <text x={la.x} y={la.y} fontSize={10} fontWeight={700} fill="#c62828" textAnchor="middle">{la.t}</text>
      <text x={lk.x} y={lk.y} fontSize={10} fontWeight={700} fill="#222" textAnchor="middle">{lk.t}</text>
      {(() => {
        const t = c.label ?? c.id.toUpperCase();
        const w = t.length * 5.4 + 8;
        const y = by - r - 4;
        return (
          <>
            <rect x={bx - w / 2} y={y - 9} width={w} height={12} rx={3} fill="#ffffff" opacity={0.92} stroke="#c8cdd4" strokeWidth={0.8} />
            <text x={bx} y={y} fontSize={9} fill="#333" textAnchor="middle" fontFamily="monospace">{t}</text>
          </>
        );
      })()}
    </g>
  );
}
