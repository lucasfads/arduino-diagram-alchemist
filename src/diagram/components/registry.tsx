import type { ReactNode } from "react";
import type { DiagramComponent, Point } from "../types";
import { Led } from "./Led";
import { Resistor } from "./Resistor";
import { PushButton } from "./PushButton";
import { RgbLed } from "./RgbLed";
import { Potentiometer } from "./Potentiometer";
import { Ldr } from "./Ldr";
import { Buzzer } from "./Buzzer";
import { MicroServo } from "./MicroServo";
import { LaserDiode } from "./LaserDiode";
import { TiltSensor } from "./TiltSensor";
import { SevenSegment } from "./SevenSegment";
import { Placeholder } from "./Placeholder";

export interface RenderProps { c: DiagramComponent; pins: Record<string, Point>; index: number }

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
  potentiometer: { pins: ["vcc", "wiper", "gnd"], implemented: true, render: (p) => <Potentiometer {...p} /> },
  "rgb-led": { pins: ["red", "common", "green", "blue"], implemented: true, render: (p) => <RgbLed {...p} /> },
  ldr: { pins: ["a", "b"], implemented: true, render: (p) => <Ldr {...p} /> },
  buzzer: { pins: ["positive", "negative"], implemented: true, render: (p) => <Buzzer {...p} /> },
  "tilt-sensor": { pins: ["vcc", "gnd", "signal"], implemented: true, render: (p) => <TiltSensor {...p} /> },
  "micro-servo": { pins: ["signal", "vcc", "gnd"], implemented: true, render: (p) => <MicroServo {...p} /> },
  "seven-segment": { pins: ["a", "b", "c", "d", "e", "f", "g", "dp", "com1", "com2"], implemented: true, render: (p) => <SevenSegment {...p} /> },
  "laser-diode": { pins: ["positive", "negative"], implemented: true, render: (p) => <LaserDiode {...p} /> },
};
