"use client";

import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { DisclaimerNote } from "@/components/DisclaimerNote";
import { MetricCard } from "@/components/MetricCard";
import {
  calculatePaintLitres,
  calculateTotalWallArea,
  formatArea,
  formatLitres,
  suggestPaintTins,
} from "@/lib/calculations";
import { useProjectStore } from "@/store/project-store";
import { Droplets, PaintBucket } from "lucide-react";

export function PaintCalculator() {
  const { project, quoteSettings, updateQuoteSettings, updateRoom } =
    useProjectStore();

  if (!project) return null;

  const totalWallArea = calculateTotalWallArea(project.rooms);
  const { paintLitres, paintLitresWithWaste } = calculatePaintLitres(
    totalWallArea,
    quoteSettings.coats,
    quoteSettings.coveragePerLitre,
    quoteSettings.wastePercent
  );
  const tins = suggestPaintTins(paintLitresWithWaste);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <MetricCard
          label="Total wall area"
          value={formatArea(totalWallArea)}
          icon={<PaintBucket className="h-5 w-5 text-accent" />}
        />
        <MetricCard
          label="Paint required"
          value={formatLitres(paintLitresWithWaste)}
          hint={`${quoteSettings.coats} coats incl. ${quoteSettings.wastePercent}% waste`}
          icon={<Droplets className="h-5 w-5 text-accent" />}
        />
        <MetricCard
          label="Suggested tins"
          value={`${tins.tins5L}×5L, ${tins.tins25L}×2.5L`}
          hint={`Base: ${formatLitres(paintLitres)}`}
        />
      </div>

      <Card className="space-y-4">
        <h3 className="text-lg font-semibold">Paint settings</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="coats">Number of coats</Label>
            <Input
              id="coats"
              type="number"
              min="1"
              value={quoteSettings.coats}
              onChange={(e) =>
                updateQuoteSettings({ coats: parseInt(e.target.value) || 1 })
              }
            />
          </div>
          <div>
            <Label htmlFor="coverage">Coverage per litre (m²/L)</Label>
            <Input
              id="coverage"
              type="number"
              min="1"
              step="0.5"
              value={quoteSettings.coveragePerLitre}
              onChange={(e) =>
                updateQuoteSettings({
                  coveragePerLitre: parseFloat(e.target.value) || 10,
                })
              }
            />
          </div>
          <div>
            <Label htmlFor="waste">Waste / touch-up (%)</Label>
            <Input
              id="waste"
              type="number"
              min="0"
              value={quoteSettings.wastePercent}
              onChange={(e) =>
                updateQuoteSettings({
                  wastePercent: parseFloat(e.target.value) || 0,
                })
              }
            />
          </div>
          <div className="flex items-end gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={quoteSettings.primerRequired}
                onChange={(e) =>
                  updateQuoteSettings({ primerRequired: e.target.checked })
                }
                className="h-4 w-4 rounded border-border text-primary"
              />
              Primer required
            </label>
          </div>
        </div>
      </Card>

      {project.rooms.map((room) => (
        <Card key={room.id} className="space-y-3">
          <h4 className="font-semibold">{room.name}</h4>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={room.ceilingIncluded ?? false}
              onChange={(e) =>
                updateRoom(room.id, { ceilingIncluded: e.target.checked })
              }
              className="h-4 w-4 rounded border-border-light text-purple"
            />
            Include ceiling area
          </label>
          {room.ceilingIncluded && (
            <div>
              <Label htmlFor={`ceiling-${room.id}`}>Ceiling area (m²)</Label>
              <Input
                id={`ceiling-${room.id}`}
                type="number"
                min="0"
                step="0.01"
                value={room.ceilingAreaM2 ?? 0}
                onChange={(e) =>
                  updateRoom(room.id, {
                    ceilingAreaM2: parseFloat(e.target.value) || 0,
                  })
                }
              />
            </div>
          )}
        </Card>
      ))}

      <DisclaimerNote>
        Paint quantity is calculated from the dimensions entered and should be
        checked before purchase.
      </DisclaimerNote>
    </div>
  );
}
