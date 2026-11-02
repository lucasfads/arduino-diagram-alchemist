# uno/diagram — Gerador de diagramas de montagem Arduino

Gera diagramas didáticos e vetoriais (SVG) de montagens com **Arduino Uno R3** e **protoboard de 400 pontos** a partir de um JSON. Mesmo JSON → mesma imagem.

## Executar

```bash
bun install
bun run dev      # abre em http://localhost:8080
bun run test     # validações e layout
```

## Publicar no GitHub Pages

O workflow `.github/workflows/deploy.yml` gera o site estático e publica automaticamente a cada push em `main`. Para habilitar, no GitHub abra **Settings → Pages** e selecione **GitHub Actions** como fonte de publicação. O endereço será `https://lucasfads.github.io/arduino-diagram-alchemist/`.

A geração estática prerenderiza a rota `/`. O prefixo de caminho é configurado no workflow para funcionar no endereço de projeto do GitHub Pages; no desenvolvimento local, o caminho continua sendo `/`.

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
examples/                    JSON de exemplo (pisca-pisca, semáforo)
src/diagram/types.ts         tipos do schema
src/diagram/geometry.ts      coordenadas da protoboard e do Arduino
src/diagram/validate.ts      validações + redes elétricas
src/diagram/routing.ts       roteamento ortogonal dos jumpers
src/diagram/Arduino.tsx      Arduino Uno R3
src/diagram/Breadboard.tsx   protoboard 400 pontos
src/diagram/components/      LED, resistor e registro de componentes
```

### Adicionar um componente

Os tipos `push-button`, `potentiometer`, `rgb-led`, `ldr`, `buzzer`, `tilt-sensor`, `micro-servo`, `seven-segment` e `laser-diode` já têm pinos definidos em `components/registry.tsx` e são desenhados como caixa genérica. Para implementar um: crie `components/Nome.tsx` (recebe `c` e as coordenadas `pins`) e troque o `stub([...])` por `{ pins, implemented: true, render }`.
