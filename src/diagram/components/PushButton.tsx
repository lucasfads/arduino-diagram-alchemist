import type { RenderProps } from "./registry";

/**
 * Botão táctil 6 mm de 4 pinos. Por convenção, a1–a2 formam um lado e b1–b2 o
 * outro (cada par é ligado internamente); apertar o botão une os dois lados.
 * O corpo é centralizado entre os quatro furos.
 */
export function PushButton({ c, pins }: RenderProps) {
  const names = ["a1", "a2", "b1", "b2"] as const;
  if (names.some((n) => !pins[n])) return null;
  const pts = names.map((n) => pins[n]);
  const xs = pts.map((p) => p.x), ys = pts.map((p) => p.y);
  const cx = (Math.min(...xs) + Math.max(...xs)) / 2;
  const cy = (Math.min(...ys) + Math.max(...ys)) / 2;
  const hx = (Math.max(...xs) - Math.min(...xs)) / 2;
  const hy = (Math.max(...ys) - Math.min(...ys)) / 2;
  const half = Math.max(8, Math.min(hx, hy) - 4);
  const t = c.label ?? c.id.toUpperCase();
  const w = t.length * 5.4 + 8;
  const ly = cy - Math.max(hy, half) - 12;
  return (
    <g data-component={c.id}>
      {pts.map((p, i) => {
        // perna sai do canto do corpo mais próximo do furo
        const corner = { x: cx + Math.sign(p.x - cx || 1) * half, y: cy + Math.sign(p.y - cy || 1) * half };
        return (
          <path key={names[i]} d={`M${p.x},${p.y} L${corner.x},${p.y} L${corner.x},${corner.y}`} fill="none" stroke="#8a8f98" strokeWidth={1.6} strokeLinejoin="round" />
        );
      })}
      <rect x={cx - half} y={cy - half} width={half * 2} height={half * 2} rx={3} fill="#767676" stroke="#455a64" strokeWidth={1.2} />
      <rect x={cx - half + 2} y={cy - half + 2} width={half * 2 - 4} height={half * 2 - 4} rx={2} fill="#767676" />
      <circle cx={cx} cy={cy} r={half * 0.6} fill="#37474f" stroke="#1c262b" strokeWidth={1.2} />
      <circle cx={cx - half * 0.2} cy={cy - half * 0.2} r={half * 0.17} fill="#ffffff" opacity={0.55} />
      {pts.map((p, i) => (
        <circle key={names[i]} cx={p.x} cy={p.y} r={2.4} fill="#555" />
      ))}
      <rect x={cx - w / 2} y={ly - 9} width={w} height={12} rx={3} fill="#ffffff" opacity={0.92} stroke="#c8cdd4" strokeWidth={0.8} />
      <text x={cx} y={ly} fontSize={9} fill="#333" textAnchor="middle" fontFamily="monospace">{t}</text>
    </g>
  );
}
