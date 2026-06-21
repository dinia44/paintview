export type Point = {
  x: number;
  y: number;
};

export type PaintColour = {
  name: string;
  hex: string;
  brand?: string;
  code?: string;
  finish?: string;
};

export type Wall = {
  id: string;
  roomId: string;
  name: string;
  imageUrl: string;
  polygon: Point[];
  widthM: number;
  heightM: number;
  deductionM2: number;
  colour?: PaintColour;
  notes?: string;
};

export type Room = {
  id: string;
  name: string;
  imageUrl?: string;
  walls: Wall[];
  ceilingIncluded?: boolean;
  ceilingAreaM2?: number;
};

export type Project = {
  id: string;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  address?: string;
  decoratorName?: string;
  quoteExpiry?: string;
  rooms: Room[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type QuoteSettings = {
  coats: number;
  coveragePerLitre: number;
  wastePercent: number;
  primerRequired: boolean;
  paintCost: number;
  primerCost: number;
  prepMaterialsCost: number;
  sundriesCost: number;
  otherMaterialsCost: number;
  prepHours: number;
  paintingHours: number;
  hourlyRate: number;
  decorators: number;
  vatEnabled: boolean;
  vatPercent: number;
  contingencyPercent: number;
  discount: number;
};

export type QuoteTotals = {
  materialsTotal: number;
  labourTotal: number;
  subtotal: number;
  contingencyAmount: number;
  preVatTotal: number;
  vatAmount: number;
  total: number;
};

export type PaintTinSuggestion = {
  tins5L: number;
  tins25L: number;
};

export type RoomAnalysisResponse = {
  suggestedWalls: {
    name: string;
    polygon: Point[];
    confidence: number;
  }[];
  detectedFeatures: {
    type: "window" | "door" | "skirting" | "radiator" | "unknown";
    polygon?: Point[];
    confidence: number;
  }[];
  warnings: string[];
};
