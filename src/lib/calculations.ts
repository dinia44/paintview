import type { PaintTinSuggestion, QuoteSettings, QuoteTotals, Room, Wall } from "./types";

export function calculateWallArea(wall: Wall): {
  grossAreaM2: number;
  netAreaM2: number;
} {
  const grossAreaM2 = wall.widthM * wall.heightM;
  const netAreaM2 = Math.max(0, grossAreaM2 - wall.deductionM2);
  return { grossAreaM2, netAreaM2 };
}

export function calculateTotalWallArea(rooms: Room[]): number {
  return rooms.reduce((total, room) => {
    const roomWallArea = room.walls.reduce((sum, wall) => {
      return sum + calculateWallArea(wall).netAreaM2;
    }, 0);
    const ceilingArea =
      room.ceilingIncluded && room.ceilingAreaM2 ? room.ceilingAreaM2 : 0;
    return total + roomWallArea + ceilingArea;
  }, 0);
}

export function calculatePaintLitres(
  totalAreaM2: number,
  coats: number,
  coveragePerLitre: number,
  wastePercent: number
): { paintLitres: number; paintLitresWithWaste: number } {
  const paintLitres = (totalAreaM2 * coats) / coveragePerLitre;
  const paintLitresWithWaste = paintLitres * (1 + wastePercent / 100);
  return { paintLitres, paintLitresWithWaste };
}

export function suggestPaintTins(litres: number): PaintTinSuggestion {
  let remaining = Math.ceil(litres * 10) / 10;
  const tins5L = Math.floor(remaining / 5);
  remaining -= tins5L * 5;
  const tins25L = remaining > 0 ? Math.ceil(remaining / 2.5) : 0;
  return { tins5L, tins25L };
}

export function calculateMaterialsTotal(settings: QuoteSettings): number {
  return (
    settings.paintCost +
    (settings.primerRequired ? settings.primerCost : 0) +
    settings.prepMaterialsCost +
    settings.sundriesCost +
    settings.otherMaterialsCost
  );
}

export function calculateLabourTotal(settings: QuoteSettings): number {
  const totalHours = settings.prepHours + settings.paintingHours;
  return totalHours * settings.hourlyRate * settings.decorators;
}

export function calculateQuoteTotal(settings: QuoteSettings): QuoteTotals {
  const materialsTotal = calculateMaterialsTotal(settings);
  const labourTotal = calculateLabourTotal(settings);
  const subtotal = materialsTotal + labourTotal;
  const contingencyAmount = subtotal * (settings.contingencyPercent / 100);
  const preVatTotal = subtotal + contingencyAmount - settings.discount;
  const vatAmount = settings.vatEnabled
    ? preVatTotal * (settings.vatPercent / 100)
    : 0;
  const total = preVatTotal + vatAmount;

  return {
    materialsTotal,
    labourTotal,
    subtotal,
    contingencyAmount,
    preVatTotal,
    vatAmount,
    total,
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(amount);
}

export function formatArea(area: number): string {
  return `${area.toFixed(2)} m²`;
}

export function formatLitres(litres: number): string {
  return `${litres.toFixed(1)} L`;
}
