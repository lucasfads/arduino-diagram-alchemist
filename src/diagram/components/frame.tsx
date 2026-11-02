import { BY } from "../geometry";
import type { Point } from "../types";

/**
 * Sistema de coordenadas local de um componente: `u` ao longo da fileira de pinos, `v` para fora dela.
 * Nas fileiras A–E o corpo cresce para cima; nas fileiras F–J, para baixo (afastando-se do canal central).
 * Com `upright`, o corpo cresce sempre para cima na tela, qualquer que seja a fileira.
 */
export function frame(pts: Point[], upright = false) {
  const first = pts[0], last = pts[pts.length - 1];
  const ang = Math.atan2(last.y - first.y, last.x - first.x);
  const dir = { x: Math.cos(ang), y: Math.sin(ang) };
  const o = { x: pts.reduce((s, p) => s + p.x, 0) / pts.length, y: pts.reduce((s, p) => s + p.y, 0) / pts.length };
  const down = !upright && o.y > BY + 142;
  let nrm = { x: Math.sin(ang), y: -Math.cos(ang) };
  if (Math.abs(nrm.y) > 0.01 && nrm.y > 0 !== down) nrm = { x: -nrm.x, y: -nrm.y };
  const at = (u: number, v: number): Point => ({ x: o.x + u * dir.x + v * nrm.x, y: o.y + u * dir.y + v * nrm.y });
  const along = (p: Point) => (p.x - o.x) * dir.x + (p.y - o.y) * dir.y;
  const labelY = (v: number) => at(0, v).y + (nrm.y > 0.01 ? 11 : -4);
  return { at, along, labelY };
}

export const path = (pts: Point[]) => pts.map((q, i) => `${i ? "L" : "M"}${q.x},${q.y}`).join(" ");

/** Polilinha ortogonal com cantos arredondados (raio máximo `r`). */
export function rounded(pts: Point[], r = 6) {
  let d = `M${pts[0].x},${pts[0].y}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const a = pts[i - 1], p = pts[i], b = pts[i + 1];
    const la = Math.hypot(a.x - p.x, a.y - p.y), lb = Math.hypot(b.x - p.x, b.y - p.y);
    const da = Math.min(r, la / 2), db = Math.min(r, lb / 2);
    d += ` L${p.x + ((a.x - p.x) / la) * da},${p.y + ((a.y - p.y) / la) * da}`;
    d += ` Q${p.x},${p.y} ${p.x + ((b.x - p.x) / lb) * db},${p.y + ((b.y - p.y) / lb) * db}`;
  }
  return `${d} L${pts[pts.length - 1].x},${pts[pts.length - 1].y}`;
}

/** Polígono fechado (retângulo no sistema local) para o `d` de um <path>. */
export const box = (at: (u: number, v: number) => Point, u0: number, v0: number, u1: number, v1: number) =>
  `${path([at(u0, v0), at(u1, v0), at(u1, v1), at(u0, v1)])} Z`;

export function Chip({ x, y, text }: { x: number; y: number; text: string }) {
  const w = text.length * 5.4 + 8;
  return (
    <>
      <rect x={x - w / 2} y={y - 9} width={w} height={12} rx={3} fill="#ffffff" opacity={0.92} stroke="#c8cdd4" strokeWidth={0.8} />
      <text x={x} y={y} fontSize={9} fill="#333" textAnchor="middle" fontFamily="monospace">{text}</text>
    </>
  );
}

export function PinDots({ pts }: { pts: Point[] }) {
  return <>{pts.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={2.4} fill="#555" />)}</>;
}
