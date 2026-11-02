import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Diagram } from "@/diagram/Diagram";
import { validate } from "@/diagram/validate";
import { routeJumpers } from "@/diagram/routing";
import { resistorBands } from "@/diagram/components/Resistor";
import type { DiagramSpec } from "@/diagram/types";
import pisca from "../../examples/pisca-pisca.json";
import botaoRgb from "../../examples/botao-rgb.json";
import sensores from "../../examples/sensores.json";
import servo from "../../examples/servo.json";

const base = (patch: Partial<DiagramSpec>): DiagramSpec => ({ board: "arduino-uno-r3", breadboard: "400-points", components: [], jumpers: [], ...patch });
const msgs = (s: DiagramSpec) => validate(s).issues.map((i) => i.message).join("\n");

describe("validação", () => {
  it("exemplo Pisca-pisca não tem problemas", () => {
    expect(validate(pisca as DiagramSpec).issues).toEqual([]);
  });
  it("exemplo Botão + LED RGB não tem problemas", () => {
    expect(validate(botaoRgb as DiagramSpec).issues).toEqual([]);
  });
  it("exemplo Potenciômetro, LDR e buzzer não tem problemas", () => {
    expect(validate(sensores as DiagramSpec).issues).toEqual([]);
  });
  it("exemplo Servo 9g não tem problemas", () => {
    expect(validate(servo as DiagramSpec).issues).toEqual([]);
  });
  it("push-button e rgb-led exigem todos os pinos", () => {
    const m = msgs(base({ components: [
      { id: "b1", type: "push-button", pins: { a1: "E5", a2: "E7" } },
      { id: "l1", type: "rgb-led", pins: { red: "E20", common: "E21", green: "E22" } },
    ] }));
    expect(m).toMatch(/b1: pino "b1" não definido/);
    expect(m).toMatch(/l1: pino "blue" não definido/);
  });
  it("detecta pino duplicado", () => {
    expect(msgs(base({ components: [{ id: "r1", type: "resistor", pins: { a: "A1", b: "A1" } }] }))).toMatch(/pino duplicado/);
  });
  it("detecta posição inexistente na protoboard", () => {
    expect(msgs(base({ components: [{ id: "r1", type: "resistor", pins: { a: "K1", b: "A31" } }] }))).toMatch(/posição inexistente.*K1/);
  });
  it("detecta componente sem conexão", () => {
    expect(msgs(base({ components: [{ id: "r1", type: "resistor", pins: { a: "A1", b: "A5" } }] }))).toMatch(/r1: componente sem conexão/);
  });
  it("detecta pino Arduino inexistente", () => {
    expect(msgs(base({ jumpers: [{ id: "J1", from: "arduino:D14", to: "breadboard:A1" }] }))).toMatch(/pino Arduino inexistente "D14"/);
  });
});

describe("layout", () => {
  it("é determinístico e só usa ângulos de 90°", () => {
    const { resolved } = validate(pisca as DiagramSpec);
    const a = routeJumpers(resolved.jumpers), b = routeJumpers(resolved.jumpers);
    expect([...a]).toEqual([...b]);
    for (const pts of a.values())
      for (let i = 0; i < pts.length - 1; i++) expect(pts[i]!.x === pts[i + 1]!.x || pts[i]!.y === pts[i + 1]!.y).toBe(true);
  });
  it("10kΩ = marrom, preto, laranja, ouro (distinto de 220Ω)", () => {
    expect(resistorBands("10kΩ")).toEqual(["#8d5524", "#000000", "#fb8c00", "#c9a227"]);
    expect(resistorBands("10k")).toEqual(resistorBands("10kΩ"));
  });
  it("servo é desenhado fora da placa com 3 fios ortogonais até os pinos", () => {
    const { resolved } = validate(servo as DiagramSpec);
    const svg = renderToStaticMarkup(createElement(Diagram, { spec: servo as DiagramSpec, resolved }));
    expect(svg).not.toMatch(/NaN|undefined|Infinity/);
    const wires = [...svg.matchAll(/data-servo-wire="(\w+)"><path d="([^"]+)"/g)];
    expect(wires.map((w) => w[1]).sort()).toEqual(["gnd", "signal", "vcc"]);
    for (const [, , d] of wires) {
      const nums = [...d.matchAll(/-?\d+(?:\.\d+)?/g)].map((m) => Number(m[0]));
      expect(Math.min(...nums.filter((_, i) => i % 2 === 1))).toBeLessThan(80);
    }
  });
  it("220Ω = vermelho, vermelho, marrom, ouro", () => {
    expect(resistorBands("220Ω")).toEqual(["#e53935", "#e53935", "#8d5524", "#c9a227"]);
  });
});
