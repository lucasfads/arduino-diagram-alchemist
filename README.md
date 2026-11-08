# uno/diagram — Gerador de diagramas de montagem Arduino

Gera diagramas didáticos e vetoriais (SVG) de montagens com **Arduino Uno R3** e **protoboard de 400 pontos** a partir de um JSON. Mesmo JSON → mesma imagem.

O projeto foi criado originalmente para ilustrar os desafios do repositório [arduino-kit-maker-subjects](https://github.com/lucasfads/arduino-kit-maker-subjects/).

## Executar

```bash
bun install
bun run dev      # abre em http://localhost:8080
bun run test     # validações e layout
```

## Editar um diagrama

1. Abra a aplicação, escolha um exemplo em **Carregar exemplo…** ou cole seu JSON.
2. A prévia atualiza ao digitar; o painel **Validação** lista erros e avisos.
3. Salve o JSON final em `examples/` para versionar junto com o desafio.

### Schema

```jsonc
{
  "title": "Projeto 01 — Pisca-pisca",
  "board": "arduino-uno-r3",
  "breadboard": "400-points",
  "components": [
    { "id": "led1", "type": "led", "color": "red", "pins": { "anode": "E14", "cathode": "E15" } },
    { "id": "r1", "type": "resistor", "value": "220Ω", "pins": { "a": "D19", "b": "D15" } }
  ],
  "jumpers": [
    { "id": "J1", "from": "arduino:GND", "to": "breadboard:A19", "color": "black" }
  ]
}
```

- **Furos da protoboard:** linhas `A`–`J`, colunas `1`–`30` (ex.: `E14`). Trilhos: `T+`, `T-` (superiores), `B+`, `B-` (inferiores), posições `1`–`25` (ex.: `T-3`).
  Conexões internas: `A–E` de uma coluna formam um grupo, `F–J` outro; cada trilho é contínuo.
- **Pinos do Arduino:** `D0`–`D13`, `A0`–`A5`, `5V`, `3V3`, `VIN`, `GND` (ao lado do D13), `GND2`, `GND3` (header de energia), `AREF`, `SDA`, `SCL`, `IOREF`, `RESET`.
- **Cores de jumper:** `black` (GND), `red` (5V), `green`, `yellow`, `blue`, `orange`, `white`, `purple`, `gray`, `brown` (sinais).
- **Rótulos `J1`, `J2`…** aparecem automaticamente com 2+ jumpers; force com `"showLabel": true|false`.

### Validações

Pinos/furos duplicados, posições inexistentes na protoboard, pinos Arduino inexistentes, componentes sem conexão, terminais em curto, ids duplicados e pinos faltando.

## Exportar

- **Exportar SVG** — arquivo vetorial puro, autocontido (sem canvas nem imagens), editável no Inkscape/Figma.
- **Exportar PNG** — renderização em 2× (1860 px), boa para o GitHub a ~800 px.

## Estrutura

```
examples/                    JSON de exemplo (pisca-pisca, semáforo, botão + LED RGB, sensores, servo, laser/tilt/display)
src/diagram/types.ts         tipos do schema
src/diagram/geometry.ts      coordenadas da protoboard e do Arduino
src/diagram/validate.ts      validações + redes elétricas
src/diagram/routing.ts       roteamento ortogonal dos jumpers
src/diagram/Arduino.tsx      Arduino Uno R3
src/diagram/Breadboard.tsx   protoboard 400 pontos
src/diagram/components/      LED, resistor, botão, LED RGB, potenciômetro, LDR, buzzer, servo e registro de componentes
```

### Componentes implementados

| Tipo | Pinos | Observações |
| --- | --- | --- |
| `led` | `anode`, `cathode` | `color`: red, green, yellow, blue, white, orange |
| `resistor` | `a`, `b` | `value`: ex. `220Ω`, `10k` (faixas coloridas) |
| `push-button` | `a1`, `a2`, `b1`, `b2` | `a1`–`a2` e `b1`–`b2` são ligados internamente; apertar une os dois lados. Em geral fica sobre o canal central (ex.: `E5`, `E7`, `F5`, `F7`) |
| `rgb-led` | `red`, `common`, `green`, `blue` | A perna `common` (a mais longa) é o catodo ou o anodo; o corpo é desenhado ao lado dos pinos, na direção `red` → `blue` |
| `potentiometer` | `vcc`, `wiper`, `gnd` | `value` opcional (ex.: `10kΩ`) aparece no rótulo; o `wiper` (cursor) vai ao pino analógico |
| `ldr` | `a`, `b` | Sem polaridade; use com um resistor de 10kΩ formando divisor de tensão |
| `buzzer` | `positive`, `negative` | A perna `+` fica marcada |
| `laser-diode` | `positive`, `negative` | Cilindro de cobre/ouro desenhado fora da placa (faixa superior), com fios vermelho (+) e azul (−) até os furos ou pinos informados |
| `tilt-sensor` | `vcc`, `gnd`, `signal` | Módulo SW-420: plaquinha azul com 3 pernas (VCC, GND, DO), trimpot, sensor e LED |
| `seven-segment` | `a`–`g`, `dp`, `com1`, `com2` | Corpo preto vertical sobre o canal central: 5 pinos em cada lado (ex.: `E20`–`E24` e `F20`–`F24`); sem letras impressas |
| `micro-servo` | `signal`, `vcc`, `gnd` | Desenhado fora da placa, na faixa superior do diagrama; os fios laranja (sinal), vermelho (+5V) e marrom (GND) vão até os pinos informados, que podem ser furos (`T+3`) ou pinos do Arduino (`arduino:D9`). Vários servos se enfileiram da direita para a esquerda |

Resistores de valores diferentes usam o mesmo tipo `resistor`: o `value` (ex.: `10kΩ`) define as faixas de cor e o texto do rótulo (10kΩ = marrom, preto, laranja).

O potenciômetro é desenhado sempre em pé (base embaixo, eixo em cima), cobrindo os furos acima dos pinos. LDR e buzzer desenham o corpo para cima quando os pinos estão nas fileiras `A`–`E` e para baixo nas fileiras `F`–`J`.

### Adicionar um componente

Todos os tipos da tabela acima estão implementados. Para adicionar um novo: crie `components/Nome.tsx` (recebe `c` e as coordenadas `pins`) e troque o `stub([...])` por `{ pins, implemented: true, render }`.
