export type ProjectStatus = "draft" | "in_progress" | "quote_sent" | "accepted";

export interface WallMeasurement {
  id: string;
  label: string;
  widthM: number;
  heightM: number;
  areaM2: number;
  deductionsM2?: number;
  points?: { x: number; y: number }[];
}

export interface PaintColour {
  id: string;
  name: string;
  brand: string;
  code: string;
  hex: string;
  finish: "Matt" | "Eggshell" | "Satin";
}

export interface QuoteBreakdown {
  materials: number;
  labour: number;
  other: number;
  vatIncluded: boolean;
  total: number;
}

export interface PaintViewProject {
  id: string;
  name: string;
  roomType: string;
  status: ProjectStatus;
  updatedAt: string;
  thumbnailUrl?: string;
  roomPhotoUrl?: string;
  walls: WallMeasurement[];
  totalWallAreaM2: number;
  paintNeededLitres: number;
  coats: number;
  selectedColour?: PaintColour;
  quote?: QuoteBreakdown;
  quoteRef?: string;
  clientName?: string;
  decoratorName?: string;
}

export type ToastMessage = { id: number; text: string };
