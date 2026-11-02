import type { ReactNode } from "react";
import type { DiagramComponent, Point } from "../types";
import { Led } from "./Led";
import { Resistor } from "./Resistor";
import { PushButton } from "./PushButton";
import { RgbLed } from "./RgbLed";
import { Placeholder } from "./Placeholder";

export interface RenderProps { c: DiagramComponent; pins: Record<string, Point> }

export interface ComponentDef {
  pins: string[];
  implemented: boolean;
  render: (p: RenderProps) => ReactNode;
}

const stub = (pins: string[]): ComponentDef => ({ pins, implemented: false, render: (p) => <Placeholder {...p} /> });

/**
 * Registro de componentes. Para adicionar um novo: crie o componente SVG em
 * ./NomeDoComponente.tsx e troque o `stub(...)` por { pins, implemented: true, render }.
 */
export const COMPONENTS: Record<string, ComponentDef> = {
  led: { pins: ["anode", "cathode"], implemented: true, render: (p) => <Led {...p} /> },
  resistor: { pins: ["a", "b"], implemented: true, render: (p) => <Resistor {...p} /> },
  "push-button": { pins: ["a1", "a2", "b1", "b2"], implemented: true, render: (p) => <PushButton {...p} /> },
  potentiometer: stub(["vcc", "wiper", "gnd"]),
  "rgb-led": { pins: ["red", "common", "green", "blue"], implemented: true, render: (p) => <RgbLed {...p} /> },
  ldr: stub(["a", "b"]),
  buzzer: stub(["positive", "negative"]),
  "tilt-sensor": stub(["a", "b"]),
  "micro-servo": stub(["signal", "vcc", "gnd"]),
  "seven-segment": stub(["a", "b", "c", "d", "e", "f", "g", "dp", "com1", "com2"]),
  "laser-diode": stub(["signal", "vcc", "gnd"]),
};
