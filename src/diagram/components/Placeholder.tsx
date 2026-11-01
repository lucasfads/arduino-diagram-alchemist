import type { RenderProps } from "./registry";

/** Renderização genérica para componentes ainda não implementados. */
export function Placeholder({ c, pins }: RenderProps) {
  const pts = Object.entries(pins);
  if (!pts.length) return null;
  const xs = pts.map(([, p]) => p.x), ys = pts.map(([, p]) => p.y);
  const x0 = Math.min(...xs) - 8, x1 = Math.max(...xs) + 8;
  const y = Math.min(...ys) - 30;
  return (
    <g data-component={c.id}>
      {pts.map(([n, p]) => (
        <g key={n}>
          <line x1={p.x} y1={p.y} x2={p.x} y2={y + 18} stroke="#8a8f98" strokeWidth={1.4} />
          <circle cx={p.x} cy={p.y} r={2.4} fill="#555" />
        </g>
      ))}
      <rect x={x0} y={y} width={Math.max(x1 - x0, 40)} height={18} rx={3} fill="#eceff1" stroke="#607d8b" strokeDasharray="3 2" />
      <text x={x0 + Math.max(x1 - x0, 40) / 2} y={y + 12} fontSize={8} textAnchor="middle" fill="#37474f" fontFamily="monospace">
        {c.label ?? `${c.id} (${c.type})`}
      </text>
    </g>
  );
}
