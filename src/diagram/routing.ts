import { AW, AX, BH, BY, endpointPoint, endpointSide, type Endpoint } from "./geometry";
import type { Point } from "./types";

const LANE = 8;
const topLane = (k: number) => BY - 12 - k * LANE;
const botLane = (k: number) => BY + BH + 12 + k * LANE;
const channelX = (k: number) => AX + AW + 12 + k * 6;

/** Rota ortogonal (somente ângulos de 90°) com faixas exclusivas por jumper. */
export function routeJumpers(jumpers: { id: string; from: Endpoint; to: Endpoint }[]): Map<string, Point[]> {
  let top = 0, bot = 0, ch = 0;
  // Ordena por distância horizontal: fios mais curtos ficam nas faixas internas (menos cruzamentos).
  const order = [...jumpers].sort((a, b) => {
    const da = Math.abs(endpointPoint(a.from).x - endpointPoint(a.to).x);
    const db = Math.abs(endpointPoint(b.from).x - endpointPoint(b.to).x);
    return da - db || a.id.localeCompare(b.id);
  });
  const routes = new Map<string, Point[]>();
  for (const j of order) {
    const a = endpointPoint(j.from), b = endpointPoint(j.to);
    const sa = endpointSide(j.from), sb = endpointSide(j.to);
    let pts: Point[];
    if (sa === sb) {
      const y = sa === "top" ? topLane(top++) : botLane(bot++);
      pts = [a, { x: a.x, y }, { x: b.x, y }, b];
    } else {
      const ya = sa === "top" ? topLane(top++) : botLane(bot++);
      const yb = sb === "top" ? topLane(top++) : botLane(bot++);
      const x = channelX(ch++);
      pts = [a, { x: a.x, y: ya }, { x, y: ya }, { x, y: yb }, { x: b.x, y: yb }, b];
    }
    routes.set(j.id, pts);
  }
  return routes;
}

/** Ponto médio do maior segmento horizontal — onde vai o rótulo. */
export function labelPoint(pts: Point[]): Point {
  let best = { len: -1, p: pts[0] };
  for (let i = 0; i < pts.length - 1; i++) {
    const [p, q] = [pts[i], pts[i + 1]];
    if (p.y === q.y && Math.abs(q.x - p.x) > best.len) best = { len: Math.abs(q.x - p.x), p: { x: (p.x + q.x) / 2, y: p.y } };
  }
  return best.p;
}
