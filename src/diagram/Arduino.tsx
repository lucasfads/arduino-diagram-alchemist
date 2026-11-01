import { AH, ARDUINO_PINS, AW, AX, AY } from "./geometry";

/** Arduino Uno R3 simplificado: placa, USB-B, jack, ATmega e headers rotulados. */
export function Arduino({ highlight }: { highlight: Set<string> }) {
  const TEAL = "#00838f";
  return (
    <g data-part="arduino">
      <rect x={AX} y={AY} width={AW} height={AH} rx={8} fill={TEAL} stroke="#005f66" strokeWidth={1.5} />
      {/* USB-B e jack de alimentação (à esquerda) */}
      <rect x={AX - 10} y={AY + 34} width={44} height={42} rx={2} fill="#b0bec5" stroke="#78909c" />
      <rect x={AX - 6} y={AY + 140} width={40} height={32} rx={3} fill="#263238" />
      {/* furos de fixação */}
      {[[AX + 14, AY + 100], [AX + AW - 16, AY + 30], [AX + AW - 16, AY + AH - 30]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={4} fill="#ffffff" stroke="#005f66" />
      ))}
      {/* ATmega328P */}
      <rect x={AX + 130} y={AY + 118} width={140} height={34} rx={2} fill="#212121" />
      <text x={AX + 200} y={AY + 139} fontSize={9} fill="#cfd8dc" textAnchor="middle" fontFamily="monospace">ATMEGA328P</text>
      <text x={AX + 110} y={AY + 90} fontSize={18} fontWeight={700} fill="#ffffff" fontFamily="sans-serif">UNO</text>
      <text x={AX + 164} y={AY + 90} fontSize={9} fill="#e0f7fa" fontFamily="sans-serif">Arduino R3</text>
      {/* headers */}
      {(["top", "bottom"] as const).map((side) => {
        const pins = ARDUINO_PINS.filter((p) => p.side === side);
        const y = pins[0].pt.y;
        return (
          <g key={side}>
            <rect x={pins[0].pt.x - 7} y={y - 6} width={pins[pins.length - 1].pt.x - pins[0].pt.x + 14} height={12} fill="#1c1c1c" rx={1} />
            {pins.map((p) => {
              const on = highlight.has(p.id);
              const ty = side === "top" ? y + 11 : y - 11;
              return (
                <g key={p.id}>
                  <rect x={p.pt.x - 2.5} y={y - 2.5} width={5} height={5} fill={on ? "#ffd54f" : "#555"} />
                  <text
                    transform={`translate(${p.pt.x + 3},${ty}) rotate(-90)`}
                    fontSize={on ? 8.5 : 7}
                    fontWeight={on ? 700 : 400}
                    fill={on ? "#ffffff" : "#b2ebf2"}
                    textAnchor={side === "top" ? "end" : "start"}
                    fontFamily="monospace"
                  >
                    {p.label}
                  </text>
                </g>
              );
            })}
          </g>
        );
      })}
      <text x={AX + 120} y={AY + 58} fontSize={7} fill="#b2ebf2" fontFamily="monospace">DIGITAL (PWM~)</text>
      <text x={AX + 150} y={AY + AH - 50} fontSize={7} fill="#b2ebf2" fontFamily="monospace">POWER</text>
      <text x={AX + 210} y={AY + AH - 50} fontSize={7} fill="#b2ebf2" fontFamily="monospace">ANALOG IN</text>
    </g>
  );
}
