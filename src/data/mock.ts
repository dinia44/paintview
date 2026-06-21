import type { PaintColour, PaintViewProject, ProjectStatus } from "@/types";

export const COLOURS: PaintColour[] = [
  { id: "1", name: "Sage Grey", brand: "Farrow & Ball", code: "No. 210", hex: "#A8B5A1", finish: "Matt" },
  { id: "2", name: "Warm Calico", brand: "Dulux", code: "90YY 56/086", hex: "#d8c3a5", finish: "Matt" },
  { id: "3", name: "Studio White", brand: "Custom", code: "PV-WHT-01", hex: "#f4efe7", finish: "Eggshell" },
  { id: "4", name: "Deep Navy", brand: "Farrow & Ball", code: "Hague Blue", hex: "#172033", finish: "Matt" },
  { id: "5", name: "Quiet Taupe", brand: "Dulux", code: "70YY 53/099", hex: "#b9a99a", finish: "Satin" },
  { id: "6", name: "Heritage Green", brand: "Little Greene", code: "Acorn", hex: "#8ba888", finish: "Matt" },
];

export const MOCK_PROJECTS: PaintViewProject[] = [
  {
    id: "p1",
    name: "Living Room",
    roomType: "Living Room",
    status: "quote_sent",
    updatedAt: new Date().toISOString(),
    walls: [
      { id: "w1", label: "Wall 1", widthM: 3.42, heightM: 2.6, areaM2: 8.89 },
      { id: "w2", label: "Wall 2", widthM: 4.1, heightM: 2.6, areaM2: 10.66 },
    ],
    totalWallAreaM2: 38.32,
    paintNeededLitres: 10.2,
    coats: 2,
    selectedColour: COLOURS[0],
    quote: { materials: 386, labour: 280, other: 76, vatIncluded: true, total: 742 },
    quoteRef: "Q-1024",
    clientName: "Sarah Mitchell",
    decoratorName: "Parker Decorators",
  },
  {
    id: "p2",
    name: "Hallway & Stairs",
    roomType: "Hallway",
    status: "draft",
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    walls: [{ id: "w3", label: "Main wall", widthM: 5.2, heightM: 2.4, areaM2: 12.48 }],
    totalWallAreaM2: 22.5,
    paintNeededLitres: 5.8,
    coats: 2,
    quote: { materials: 120, labour: 150, other: 45, vatIncluded: true, total: 315 },
    quoteRef: "Q-1023",
  },
  {
    id: "p3",
    name: "Bedroom",
    roomType: "Bedroom",
    status: "in_progress",
    updatedAt: new Date(Date.now() - 172800000).toISOString(),
    walls: [{ id: "w4", label: "Feature wall", widthM: 3.8, heightM: 2.5, areaM2: 9.5 }],
    totalWallAreaM2: 28.1,
    paintNeededLitres: 7.4,
    coats: 2,
    selectedColour: COLOURS[2],
    quote: { materials: 210, labour: 220, other: 68, vatIncluded: true, total: 498 },
    quoteRef: "Q-1022",
  },
];

export const DEMO_ROOM_PHOTO =
  "data:image/svg+xml," +
  encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
    <rect fill="#e8e0d4" width="800" height="600"/>
    <rect fill="#d4cbb8" x="0" y="400" width="800" height="200"/>
    <rect fill="#c9b99a" x="80" y="120" width="640" height="280" rx="4"/>
    <rect fill="#87a089" opacity="0.35" x="80" y="120" width="640" height="280"/>
    <rect fill="#fff" x="520" y="180" width="120" height="140" rx="2" opacity="0.9"/>
    <rect fill="#8b7355" x="680" y="280" width="40" height="120"/>
  </svg>`);

export function formatGbp(n: number) {
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(n);
}

export function formatRelativeDate(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
}

export function statusLabel(s: ProjectStatus) {
  const map = {
    draft: "Draft",
    in_progress: "In Progress",
    quote_sent: "Quote sent",
    accepted: "Accepted",
  };
  return map[s];
}

export function calcWallArea(w: { widthM: number; heightM: number; deductionsM2?: number }) {
  return Math.max(0, w.widthM * w.heightM - (w.deductionsM2 ?? 0));
}

export function calcPaintLitres(areaM2: number, coats = 2, coverage = 10, waste = 10) {
  const base = (areaM2 * coats) / coverage;
  return Math.ceil(base * (1 + waste / 100) * 10) / 10;
}
