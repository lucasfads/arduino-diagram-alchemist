import { describe, expect, it } from "vitest";
import { validate } from "@/diagram/validate";
import { routeJumpers } from "@/diagram/routing";
import { resistorBands } from "@/diagram/components/Resistor";
import type { DiagramSpec } from "@/diagram/types";
import pisca from "../../examples/pisca-pisca.json";
import botaoRgb from "../../examples/botao-rgb.json";

const base = (patch: Partial<DiagramSpec>): DiagramSpec => ({ board: "arduino-uno-r3", breadboard: "400-points", components: [], jumpers: [], ...patch });
const msgs = (s: DiagramSpec) => validate(s).issues.map((i) => i.message).join("\n");

describe("validação", () => {
  it("exemplo Pisca-pisca não tem problemas", () => {
    expect(validate(pisca as DiagramSpec).issues).toEqual([]);
  });
  it("exemplo Botão + LED RGB não tem problemas", () => {
    expect(validate(botaoRgb as DiagramSpec).issues).toEqual([]);
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
  it("220Ω = vermelho, vermelho, marrom, ouro", () => {
    expect(resistorBands("220Ω")).toEqual(["#e53935", "#e53935", "#8d5524", "#c9a227"]);
  });
});
