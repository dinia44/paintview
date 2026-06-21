import type { PaintColour } from "./types";

export const starterColours: PaintColour[] = [
  { name: "Soft Sage", hex: "#A8B5A0", brand: "Custom", code: "PV-SAGE-01" },
  { name: "Warm Stone", hex: "#C8BCA8", brand: "Custom", code: "PV-STONE-02" },
  { name: "Calm Clay", hex: "#B98F79", brand: "Custom", code: "PV-CLAY-03" },
  { name: "Clean Ivory", hex: "#EFE8D8", brand: "Custom", code: "PV-IVORY-04" },
  { name: "Deep Navy", hex: "#172033", brand: "Custom", code: "PV-NAVY-05" },
  { name: "Muted Olive", hex: "#737C5D", brand: "Custom", code: "PV-OLIVE-06" },
];

export function isValidHex(hex: string): boolean {
  return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(hex);
}

export function normalizeHex(hex: string): string {
  const trimmed = hex.trim();
  if (!trimmed.startsWith("#")) return `#${trimmed}`;
  return trimmed;
}
