import type { Project, QuoteSettings } from "./types";

const PROJECT_KEY = "paintview_project";
const QUOTE_SETTINGS_KEY = "paintview_quote_settings";

export const defaultQuoteSettings: QuoteSettings = {
  coats: 2,
  coveragePerLitre: 10,
  wastePercent: 10,
  primerRequired: true,
  paintCost: 0,
  primerCost: 0,
  prepMaterialsCost: 0,
  sundriesCost: 0,
  otherMaterialsCost: 0,
  prepHours: 3,
  paintingHours: 8,
  hourlyRate: 30,
  decorators: 1,
  vatEnabled: true,
  vatPercent: 20,
  contingencyPercent: 5,
  discount: 0,
};

export function saveProject(project: Project): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PROJECT_KEY, JSON.stringify(project));
}

export function loadProject(): Project | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(PROJECT_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Project;
  } catch {
    return null;
  }
}

export function clearProject(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(PROJECT_KEY);
}

export function saveQuoteSettings(settings: QuoteSettings): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(QUOTE_SETTINGS_KEY, JSON.stringify(settings));
}

export function loadQuoteSettings(): QuoteSettings | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(QUOTE_SETTINGS_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as QuoteSettings;
  } catch {
    return null;
  }
}
