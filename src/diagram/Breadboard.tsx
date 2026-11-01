import { BH, BW, BX, BY, P, ROWS_BOT, ROWS_TOP, colX, railX, rowY } from "./geometry";

const COLS = Array.from({ length: 30 }, (_, i) => i + 1);
const RAIL_IDX = Array.from({ length: 25 }, (_, i) => i + 1);

/** Protoboard 400 pontos com conexões internas visíveis (grupos de 5 e trilhos). */
export function Breadboard() {
  const hole = (x: number, y: number, k: string) => (
    <rect key={k} x={x - 2.6} y={y - 2.6} width={5.2} height={5.2} rx={1} fill="#4a4f57" />
  );
  const rail = (row: string, color: string, sign: string) => {
    const y = rowY(row);
    return (
      <g key={row}>
        <line x1={railX(1) - 6} y1={y} x2={railX(25) + 6} y2={y} stroke={color} strokeWidth={6} strokeOpacity={0.14} strokeLinecap="round" />
        {RAIL_IDX.map((i) => hole(railX(i), y, `${row}${i}`))}
        <text x={BX + 14} y={y + 3.5} fontSize={11} fontWeight={700} fill={color} textAnchor="middle">{sign}</text>
        <text x={BX + BW - 14} y={y + 3.5} fontSize={11} fontWeight={700} fill={color} textAnchor="middle">{sign}</text>
      </g>
    );
  };
  const RED = "#d32f2f", BLUE = "#1565c0";
  return (
    <g data-part="breadboard">
      <rect x={BX} y={BY} width={BW} height={BH} rx={6} fill="#f7f6f2" stroke="#c8c5bc" strokeWidth={1.2} />
      {/* linhas guia dos trilhos */}
      {[["T+", RED, -9], ["T-", BLUE, 9], ["B+", RED, -9], ["B-", BLUE, 9]].map(([r, c, o]) => (
        <line key={r as string} x1={railX(1) - 6} x2={railX(25) + 6} y1={rowY(r as string) + (o as number)} y2={rowY(r as string) + (o as number)} stroke={c as string} strokeWidth={1.2} />
      ))}
      {rail("T+", RED, "+")}
      {rail("T-", BLUE, "−")}
      {rail("B+", RED, "+")}
      {rail("B-", BLUE, "−")}
      {/* separação central */}
      <rect x={BX + 8} y={rowY("E") + 11} width={BW - 16} height={P + 2} rx={2} fill="#e6e3da" />
      {/* grupos de 5 furos conectados */}
      {COLS.map((c) => (
        <g key={c}>
          <line x1={colX(c)} x2={colX(c)} y1={rowY("A")} y2={rowY("E")} stroke="#b9b5a8" strokeWidth={6} strokeLinecap="round" strokeOpacity={0.45} />
          <line x1={colX(c)} x2={colX(c)} y1={rowY("F")} y2={rowY("J")} stroke="#b9b5a8" strokeWidth={6} strokeLinecap="round" strokeOpacity={0.45} />
          {[...ROWS_TOP, ...ROWS_BOT].map((r) => hole(colX(c), rowY(r), `${r}${c}`))}
          {(c === 1 || c % 5 === 0) && (
            <>
              <text x={colX(c)} y={rowY("A") - 11} fontSize={8} fill="#6b6f76" textAnchor="middle" fontFamily="monospace">{c}</text>
              <text x={colX(c)} y={rowY("J") + 16} fontSize={8} fill="#6b6f76" textAnchor="middle" fontFamily="monospace">{c}</text>
            </>
          )}
        </g>
      ))}
      {[...ROWS_TOP, ...ROWS_BOT].map((r) => (
        <g key={r}>
          <text x={BX + 18} y={rowY(r) + 3} fontSize={8} fill="#6b6f76" textAnchor="middle" fontFamily="monospace">{r}</text>
          <text x={BX + BW - 18} y={rowY(r) + 3} fontSize={8} fill="#6b6f76" textAnchor="middle" fontFamily="monospace">{r}</text>
        </g>
      ))}
    </g>
  );
}
