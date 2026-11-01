import { endpointKey, parseEndpoint, type Endpoint } from "./geometry";
import { COMPONENTS } from "./components/registry";
import type { DiagramSpec, Issue } from "./types";

export interface Resolved {
  components: { id: string; pins: Record<string, Endpoint> }[];
  jumpers: { id: string; from: Endpoint; to: Endpoint }[];
}

/** Valida a montagem e resolve endereços. Determinístico. */
export function validate(spec: DiagramSpec): { issues: Issue[]; resolved: Resolved } {
  const issues: Issue[] = [];
  const err = (message: string) => issues.push({ level: "error", message });
  const warn = (message: string) => issues.push({ level: "warning", message });
  const resolved: Resolved = { components: [], jumpers: [] };

  if (spec.board !== "arduino-uno-r3") err(`board "${spec.board}" não suportado (use "arduino-uno-r3")`);
  if (spec.breadboard !== "400-points") err(`breadboard "${spec.breadboard}" não suportada (use "400-points")`);

  const used = new Map<string, string>(); // furo → quem usa
  const ids = new Set<string>();
  const claim = (e: Endpoint, who: string) => {
    const k = endpointKey(e);
    const prev = used.get(k);
    if (prev) err(`pino duplicado: ${k.replace(/^\w+:/, "")} usado por ${prev} e ${who}`);
    else used.set(k, who);
  };
  const checkId = (id: string) => {
    if (!id) err("item sem id");
    else if (ids.has(id)) err(`id duplicado "${id}"`);
    ids.add(id);
  };

  for (const c of spec.components ?? []) {
    checkId(c.id);
    const def = COMPONENTS[c.type];
    if (!def) { err(`${c.id}: tipo desconhecido "${c.type}"`); continue; }
    if (!def.implemented) warn(`${c.id}: "${c.type}" ainda é um esboço (renderização genérica)`);
    const pins: Record<string, Endpoint> = {};
    for (const name of def.pins) if (!c.pins?.[name]) err(`${c.id}: pino "${name}" não definido`);
    for (const [name, ref] of Object.entries(c.pins ?? {})) {
      if (!def.pins.includes(name)) { err(`${c.id}: pino "${name}" não existe em ${c.type} (${def.pins.join(", ")})`); continue; }
      const e = parseEndpoint(ref.includes(":") ? ref : `breadboard:${ref}`);
      if ("error" in e) { err(`${c.id}.${name}: ${e.error}`); continue; }
      claim(e, `${c.id}.${name}`);
      pins[name] = e;
    }
    resolved.components.push({ id: c.id, pins });
  }

  for (const j of spec.jumpers ?? []) {
    checkId(j.id);
    const a = parseEndpoint(j.from);
    const b = parseEndpoint(j.to);
    if ("error" in a) err(`${j.id}: ${a.error}`);
    if ("error" in b) err(`${j.id}: ${b.error}`);
    if ("error" in a || "error" in b) continue;
    claim(a, j.id);
    claim(b, j.id);
    resolved.jumpers.push({ id: j.id, from: a, to: b });
  }

  // Redes: jumpers unem os grupos internos das extremidades.
  const parent = new Map<string, string>();
  const find = (x: string): string => {
    const p = parent.get(x) ?? x;
    if (p === x) return x;
    const r = find(p);
    parent.set(x, r);
    return r;
  };
  const union = (a: string, b: string) => parent.set(find(a), find(b));
  for (const j of resolved.jumpers) union(j.from.net, j.to.net);

  const endpointsPerNet = new Map<string, string[]>();
  const add = (net: string, who: string) => {
    const r = find(net);
    endpointsPerNet.set(r, [...(endpointsPerNet.get(r) ?? []), who]);
  };
  for (const c of resolved.components) for (const [n, e] of Object.entries(c.pins)) add(e.net, `${c.id}.${n}`);
  for (const j of resolved.jumpers) { add(j.from.net, j.id); add(j.to.net, j.id); }

  for (const c of resolved.components) {
    const entries = Object.entries(c.pins);
    if (!entries.length) continue;
    const connected = entries.some(([n, e]) => (endpointsPerNet.get(find(e.net)) ?? []).some((w) => w !== `${c.id}.${n}`));
    if (!connected) warn(`${c.id}: componente sem conexão`);
    const nets = entries.map(([, e]) => find(e.net));
    if (entries.length === 2 && nets[0] === nets[1]) warn(`${c.id}: os dois terminais estão na mesma rede (curto)`);
  }

  return { issues, resolved };
}
