import type { RenderProps } from "./registry";

const BAND = ["#000000", "#8d5524", "#e53935", "#fb8c00", "#fdd835", "#43a047", "#1e88e5", "#8e24aa", "#9e9e9e", "#ffffff"];
const GOLD = "#c9a227";

/** "220Ω" | "10k" | "4,7kΩ" → cores das 4 faixas (tolerância ouro). */
export function resistorBands(value?: string): string[] {
  const m = /^\s*([\d.,]+)\s*([kKmM]?)/.exec(value ?? "");
  if (!m) return [];
  let ohms = parseFloat(m[1].replace(",", ".")) * ({ k: 1e3, K: 1e3, m: 1e6, M: 1e6 }[m[2]] ?? 1);
  if (!isFinite(ohms) || ohms < 10) return [];
  let exp = 0;
  while (ohms >= 100) { ohms /= 10; exp++; }
  const digits = Math.round(ohms);
  return [BAND[Math.floor(digits / 10)], BAND[digits % 10], BAND[Math.min(exp, 9)], GOLD];
}

export function Resistor({ c, pins }: RenderProps) {
  const a = pins.a, b = pins.b;
  if (!a || !b) return null;
  const dx = b.x - a.x, dy = b.y - a.y;
  const len = Math.hypot(dx, dy);
  const ang = (Math.atan2(dy, dx) * 180) / Math.PI;
  const bodyL = Math.min(34, len - 10);
  const bands = resistorBands(c.value);
  const cx = (a.x + b.x) / 2, cy = (a.y + b.y) / 2;
  const upright = ang > 90 || ang <= -90 ? ang + 180 : ang;
  return (
    <g data-component={c.id}>
      <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#8a8f98" strokeWidth={1.6} />
      <g transform={`translate(${cx},${cy}) rotate(${ang})`}>
        <rect x={-bodyL / 2} y={-5} width={bodyL} height={10} rx={4} fill="#e8cfa0" stroke="#9c7a43" strokeWidth={1} />
        {bands.map((col, i) => (
          <rect key={i} x={-bodyL / 2 + 5 + i * ((bodyL - 12) / 3.4) + (i === 3 ? 3 : 0)} y={-5} width={3} height={10} fill={col} />
        ))}
      </g>
      <circle cx={a.x} cy={a.y} r={2.4} fill="#555" />
      <circle cx={b.x} cy={b.y} r={2.4} fill="#555" />
      <g transform={`translate(${cx},${cy}) rotate(${upright}) translate(0,-9)`}>
        {(() => {
          const t = (c.label ?? c.id.toUpperCase()) + (c.value ? ` ${c.value}` : "");
          const w = t.length * 5.4 + 8;
          return (
            <>
              <rect x={-w / 2} y={-8} width={w} height={12} rx={3} fill="#ffffff" opacity={0.92} stroke="#c8cdd4" strokeWidth={0.8} />
              <text y={1.5} fontSize={9} fill="#333" textAnchor="middle" fontFamily="monospace">{t}</text>
            </>
          );
        })()}
      </g>
    </g>
  );
}
