import { forwardRef } from "react";
import { Arduino } from "./Arduino";
import { Breadboard } from "./Breadboard";
import { CANVAS_H, CANVAS_W, endpointPoint } from "./geometry";
import { COMPONENTS } from "./components/registry";
import { labelPoint, routeJumpers } from "./routing";
import type { Resolved } from "./validate";
import type { DiagramSpec, Point } from "./types";

export const WIRE_COLORS: Record<string, string> = {
  black: "#212121", red: "#e53935", green: "#2e7d32", yellow: "#f9a825", blue: "#1565c0",
  orange: "#ef6c00", white: "#cfd8dc", purple: "#6a1b9a", gray: "#757575", brown: "#6d4c41",
};

interface Props { spec: DiagramSpec; resolved: Resolved }

/** SVG 100% vetorial, autocontido (sem classes CSS externas). */
export const Diagram = forwardRef<SVGSVGElement, Props>(function Diagram({ spec, resolved }, ref) {
  const routes = routeJumpers(resolved.jumpers);
  const highlight = new Set(
    resolved.jumpers.flatMap((j) => [j.from, j.to]).flatMap((e) => (e.kind === "arduino" ? [e.pin.id] : [])),
  );
  const showLabels = (j: DiagramSpec["jumpers"][number]) => j.showLabel ?? spec.jumpers.length >= 2;
  return (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}
      width={CANVAS_W}
      height={CANVAS_H}
      fontFamily="'IBM Plex Sans', Helvetica, Arial, sans-serif"
    >
      <rect width={CANVAS_W} height={CANVAS_H} fill="#ffffff" />
      {spec.title && (
        <text x={20} y={28} fontSize={16} fontWeight={700} fill="#1a1a1a">{spec.title}</text>
      )}
      <Arduino highlight={highlight} />
      <Breadboard />
      {spec.jumpers.map((j) => {
        const pts = routes.get(j.id);
        if (!pts) return null;
        const col = WIRE_COLORS[j.color ?? "blue"] ?? j.color ?? WIRE_COLORS.blue;
        const d = pts.map((p, i) => `${i ? "L" : "M"}${p.x},${p.y}`).join(" ");
        return (
          <g key={j.id} data-jumper={j.id}>
            <path d={d} fill="none" stroke="#ffffff" strokeWidth={5.5} strokeLinejoin="miter" strokeLinecap="square" />
            <path d={d} fill="none" stroke={col} strokeWidth={3} strokeLinejoin="miter" strokeLinecap="square" />
            {[pts[0], pts[pts.length - 1]].map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r={3.6} fill={col} stroke="#ffffff" strokeWidth={1} />
            ))}
          </g>
        );
      })}
      {spec.jumpers.map((j) => {
        const pts = routes.get(j.id);
        if (!pts || !showLabels(j)) return null;
        const col = WIRE_COLORS[j.color ?? "blue"] ?? j.color ?? WIRE_COLORS.blue;
        const lp = labelPoint(pts);
        return (
          <g key={j.id} data-jumper-label={j.id}>
            <rect x={lp.x - 11} y={lp.y - 6.5} width={22} height={13} rx={3} fill="#ffffff" stroke={col} strokeWidth={1.2} />
            <text x={lp.x} y={lp.y + 3.5} fontSize={9} fontWeight={700} fill="#1a1a1a" textAnchor="middle" fontFamily="monospace">{j.id}</text>
          </g>
        );
      })}
      {spec.components.map((c, i) => {
        const r = resolved.components.find((x) => x.id === c.id);
        const def = COMPONENTS[c.type];
        if (!r || !def) return null;
        const pins: Record<string, Point> = Object.fromEntries(Object.entries(r.pins).map(([n, e]) => [n, endpointPoint(e)]));
        const index = spec.components.slice(0, i).filter((x) => x.type === c.type).length;
        return <g key={c.id}>{def.render({ c, pins, index })}</g>;
      })}
    </svg>
  );
});
