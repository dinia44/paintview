import {
  calculatePaintLitres,
  calculateQuoteTotal,
  calculateTotalWallArea,
  formatCurrency,
  suggestPaintTins,
} from "./calculations";
import type { PaintColour, Project, QuoteSettings } from "./types";

export function getPrimaryColour(project: Project): PaintColour | null {
  for (const room of project.rooms) {
    for (const wall of room.walls) {
      if (wall.colour) return wall.colour;
    }
  }
  return null;
}

export function formatQuoteText(
  project: Project,
  settings: QuoteSettings
): string {
  const totalArea = calculateTotalWallArea(project.rooms);
  const { paintLitresWithWaste } = calculatePaintLitres(
    totalArea,
    settings.coats,
    settings.coveragePerLitre,
    settings.wastePercent
  );
  const tins = suggestPaintTins(paintLitresWithWaste);
  const totals = calculateQuoteTotal(settings);
  const colour = getPrimaryColour(project);
  const roomNames = project.rooms.map((r) => r.name).join(", ") || "—";

  const lines = [
    "PaintView Quote",
    "",
    `Client: ${project.clientName}`,
    `Address: ${project.address || "—"}`,
    `Room(s): ${roomNames}`,
    "",
    "Scope of work:",
    "- Prepare surfaces",
    "- Protect floors and fittings",
    "- Paint selected walls",
    `- Apply ${settings.coats} coat(s)`,
    "- Clean working area after completion",
    "",
    "Measurements:",
    `Total paintable wall area: ${totalArea.toFixed(2)} m²`,
    `Paint required: ${paintLitresWithWaste.toFixed(1)} litres`,
    `Suggested tins: ${tins.tins5L} × 5L, ${tins.tins25L} × 2.5L`,
    "",
    "Colour:",
    colour?.name || "—",
    `Brand: ${colour?.brand || "—"}`,
    `Code: ${colour?.code || "—"}`,
    `Finish: ${colour?.finish || "—"}`,
    "",
    "Costs:",
    `Materials: ${formatCurrency(totals.materialsTotal)}`,
    `Labour: ${formatCurrency(totals.labourTotal)}`,
    `VAT: ${formatCurrency(totals.vatAmount)}`,
    `Total: ${formatCurrency(totals.total)}`,
    "",
    "Notes:",
    project.notes || "—",
    "",
    "This quote is a guide until final site conditions are confirmed.",
  ];

  return lines.join("\n");
}

export function getClientQuoteUrl(projectId: string): string {
  if (typeof window !== "undefined") {
    return `${window.location.origin}/client-view?id=${projectId}`;
  }
  return `/client-view?id=${projectId}`;
}
