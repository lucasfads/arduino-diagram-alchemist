/** Schema JSON de uma montagem (v1). */
export type JumperColor =
  | "black" | "red" | "green" | "yellow" | "blue" | "orange" | "white" | "purple" | "gray" | "brown";

export type ComponentType =
  | "led" | "resistor" | "push-button" | "potentiometer" | "rgb-led" | "ldr" | "buzzer"
  | "tilt-sensor" | "micro-servo" | "seven-segment" | "laser-diode";

export interface DiagramComponent {
  id: string;
  type: ComponentType | string;
  /** Cor (LED) — red, green, yellow, blue, white */
  color?: string;
  /** Valor (resistor) — ex.: "220Ω", "10kΩ" */
  value?: string;
  label?: string;
  /** Nome do pino → furo da protoboard, ex.: { anode: "E14" } */
  pins: Record<string, string>;
}

export interface DiagramJumper {
  id: string;
  /** "arduino:D11" | "breadboard:A14" | "breadboard:T+3" */
  from: string;
  to: string;
  color?: JumperColor | string;
  /** Mostrar rótulo (padrão: true quando houver 4+ jumpers) */
  showLabel?: boolean;
}

export interface DiagramSpec {
  title?: string;
  board: "arduino-uno-r3";
  breadboard: "400-points";
  components: DiagramComponent[];
  jumpers: DiagramJumper[];
}

export interface Point { x: number; y: number }

export interface Issue {
  level: "error" | "warning";
  message: string;
}
