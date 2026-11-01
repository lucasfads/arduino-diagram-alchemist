const download = (href: string, name: string) => {
  const a = document.createElement("a");
  a.href = href;
  a.download = name;
  a.click();
};

export function svgString(svg: SVGSVGElement) {
  return '<?xml version="1.0" encoding="UTF-8"?>\n' + new XMLSerializer().serializeToString(svg);
}

export function exportSvg(svg: SVGSVGElement, name: string) {
  const url = URL.createObjectURL(new Blob([svgString(svg)], { type: "image/svg+xml" }));
  download(url, `${name}.svg`);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** PNG em 2x (o canvas é usado só na exportação; o diagrama continua vetorial). */
export async function exportPng(svg: SVGSVGElement, name: string, scale = 2) {
  const w = svg.viewBox.baseVal.width, h = svg.viewBox.baseVal.height;
  const url = URL.createObjectURL(new Blob([svgString(svg)], { type: "image/svg+xml" }));
  const img = new Image();
  await new Promise<void>((res, rej) => { img.onload = () => res(); img.onerror = rej; img.src = url; });
  const canvas = document.createElement("canvas");
  canvas.width = w * scale;
  canvas.height = h * scale;
  canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
  URL.revokeObjectURL(url);
  download(canvas.toDataURL("image/png"), `${name}.png`);
}

export const slug = (s?: string) =>
  (s ?? "diagrama").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "diagrama";
