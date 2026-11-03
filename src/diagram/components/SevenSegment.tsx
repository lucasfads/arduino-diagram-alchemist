import type { RenderProps } from "./registry";
import { Chip } from "./frame";

const NAMES = ["a", "b", "c", "d", "e", "f", "g", "dp", "com1", "com2"] as const;

/**
 * Display de 7 segmentos (1 dígito, 10 pinos): corpo preto vertical sobre o canal central,
 * com 5 pinos em cada lado (ex.: `E20`–`E24` e `F20`–`F24`) e o dígito aceso em vermelho.
 */
export function SevenSegment({ c, pins }: RenderProps) {
  if (NAMES.some((n) => !pins[n])) return null;
  const pts = NAMES.map((n) => pins[n]);
  const xs = pts.map((p) => p.x), ys = pts.map((p) => p.y);
  const cx = (Math.min(...xs) + Math.max(...xs)) / 2;
  const cy = (Math.min(...ys) + Math.max(...ys)) / 2;
  const bw = Math.max(64, Math.max(...xs) - Math.min(...xs) + 18);
  const bh = Math.max(bw * 1.3, Math.max(...ys) - Math.min(...ys) + 60);
  const dw = bw * 0.5, dh = bh * 0.56;
  const seg = (x1: number, y1: number, x2: number, y2: number) => (
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#e53935" strokeWidth={4.4} strokeLinecap="round" />
  );
  const L = cx - dw / 2 - 3, R = cx + dw / 2 - 3, T = cy - dh / 2, B = cy + dh / 2;
  const t = c.label ?? c.id.toUpperCase();
  return (
    <g data-component={c.id}>
      <rect x={cx - bw / 2} y={cy - bh / 2} width={bw} height={bh} rx={3} fill="#141414" stroke="#000000" strokeWidth={1.5} />
      <rect x={cx - bw / 2 + 3} y={cy - bh / 2 + 3} width={bw - 6} height={bh - 6} rx={2} fill="none" stroke="#2e2e2e" strokeWidth={1} />
      {seg(L + 4, T, R - 4, T)}
      {seg(L, T + 4, L, cy - 3)}
      {seg(R, T + 4, R, cy - 3)}
      {seg(L + 4, cy, R - 4, cy)}
      {seg(L, cy + 3, L, B - 4)}
      {seg(R, cy + 3, R, B - 4)}
      {seg(L + 4, B, R - 4, B)}
      <circle cx={R + 9} cy={B} r={3.2} fill="#e53935" />
      <Chip x={cx} y={cy - bh / 2 - 6} text={t} />
    </g>
  );
}
