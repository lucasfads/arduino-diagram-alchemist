import type { Point } from "./types";

/** Geometria fixa e determinística (unidades SVG). */
export const P = 16; // passo entre furos (0,1")
export const CANVAS_W = 930;
export const CANVAS_H = 550;

// Protoboard
export const BX = 370;
export const BY = 160;
export const BW = 72 + 29 * P;
export const BH = 284;
export const ROWS_TOP = ["A", "B", "C", "D", "E"] as const;
export const ROWS_BOT = ["F", "G", "H", "I", "J"] as const;
export const RAILS = ["T+", "T-", "B+", "B-"] as const;

export const colX = (c: number) => BX + 36 + (c - 1) * P;
const ROW_Y: Record<string, number> = {
  "T+": BY + 18,
  "T-": BY + 18 + P,
  ...Object.fromEntries(ROWS_TOP.map((r, i) => [r, BY + 62 + i * P])),
  ...Object.fromEntries(ROWS_BOT.map((r, i) => [r, BY + 158 + i * P])),
  "B+": BY + 250,
  "B-": BY + 266,
};
export const rowY = (r: string) => ROW_Y[r];
export const railX = (i: number) => colX(1) + 8 + (i - 1 + Math.floor((i - 1) / 5)) * P;

export interface Hole {
  kind: "grid" | "rail";
  row: string; // A–J ou T+/T-/B+/B-
  index: number; // coluna 1–30 ou posição do trilho 1–25
  /** Grupo de conexão interna */
  net: string;
  side: "top" | "bottom";
  pt: Point;
}

/** "E14" ou "T+3" → furo; null se inexistente. */
export function parseHole(code: string): Hole | null {
  const s = code.trim().toUpperCase();
  let m = /^([TB][+-])(\d{1,2})$/.exec(s);
  if (m) {
    const i = Number(m[2]);
    if (i < 1 || i > 25) return null;
    return { kind: "rail", row: m[1], index: i, net: `rail:${m[1]}`, side: m[1][0] === "T" ? "top" : "bottom", pt: { x: railX(i), y: rowY(m[1]) } };
  }
  m = /^([A-J])(\d{1,2})$/.exec(s);
  if (m) {
    const c = Number(m[2]);
    if (c < 1 || c > 30) return null;
    const top = "ABCDE".includes(m[1]);
    return { kind: "grid", row: m[1], index: c, net: `col:${c}:${top ? "top" : "bot"}`, side: top ? "top" : "bottom", pt: { x: colX(c), y: rowY(m[1]) } };
  }
  return null;
}

// Arduino Uno R3
export const AX = 20;
export const AW = 300;
export const AH = 210;
export const AY = BY + BH / 2 - AH / 2;
const PITCH = 14;

export interface ArduinoPin { id: string; label: string; pt: Point; side: "top" | "bottom" }

function header(ids: (string | null)[], startX: number, y: number, side: "top" | "bottom", gapAfter: number) {
  const out: ArduinoPin[] = [];
  let x = startX;
  ids.forEach((id, i) => {
    if (id) out.push({ id: id.split("|")[0], label: id.split("|")[1] ?? id, pt: { x, y }, side });
    x += PITCH + (i === gapAfter ? 12 : 0);
  });
  return out;
}

export const ARDUINO_PINS: ArduinoPin[] = [
  ...header(
    ["SCL", "SDA", "AREF", "GND", "D13|13", "D12|12", "D11|~11", "D10|~10", "D9|~9", "D8|8", "D7|7", "D6|~6", "D5|~5", "D4|4", "D3|~3", "D2|2", "D1|TX1", "D0|RX0"],
    AX + 22, AY + 12, "top", 9,
  ),
  ...header(
    ["IOREF", "RESET", "3V3|3.3V", "5V", "GND2|GND", "GND3|GND", "VIN", "A0", "A1", "A2", "A3", "A4", "A5"],
    AX + 92, AY + AH - 12, "bottom", 6,
  ),
];
export const arduinoPin = (id: string) => ARDUINO_PINS.find((p) => p.id === id.trim().toUpperCase());

export type Endpoint =
  | { kind: "arduino"; pin: ArduinoPin; net: string }
  | { kind: "breadboard"; hole: Hole; net: string };

const GND_NET = "ard:GND";
export function parseEndpoint(ref: string): Endpoint | { error: string } {
  const [ns, rest] = ref.includes(":") ? ref.split(":", 2) : ["breadboard", ref];
  if (ns === "arduino") {
    const pin = arduinoPin(rest);
    if (!pin) return { error: `pino Arduino inexistente "${rest}"` };
    const net = pin.id.startsWith("GND") ? GND_NET : `ard:${pin.id}`;
    return { kind: "arduino", pin, net };
  }
  if (ns === "breadboard") {
    const hole = parseHole(rest);
    if (!hole) return { error: `posição inexistente na protoboard "${rest}"` };
    return { kind: "breadboard", hole, net: hole.net };
  }
  return { error: `prefixo desconhecido "${ns}" (use arduino: ou breadboard:)` };
}

export const endpointKey = (e: Endpoint) =>
  e.kind === "arduino" ? `arduino:${e.pin.id}` : `breadboard:${e.hole.row}${e.hole.index}`;
export const endpointPoint = (e: Endpoint) => (e.kind === "arduino" ? e.pin.pt : e.hole.pt);
export const endpointSide = (e: Endpoint) => (e.kind === "arduino" ? e.pin.side : e.hole.side);
