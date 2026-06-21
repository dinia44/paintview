"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { DisclaimerNote } from "@/components/DisclaimerNote";
import { MetricCard } from "@/components/MetricCard";
import {
  calculatePaintLitres,
  calculateQuoteTotal,
  calculateTotalWallArea,
  formatArea,
  formatCurrency,
  formatLitres,
  suggestPaintTins,
} from "@/lib/calculations";
import { getPrimaryColour } from "@/lib/quoteFormatter";
import { useProjectStore } from "@/store/project-store";
import { ShareActions } from "./ShareActions";

export function QuoteBuilder() {
  const { project, quoteSettings, updateQuoteSettings, updateProject } =
    useProjectStore();

  if (!project) return null;

  const totalArea = calculateTotalWallArea(project.rooms);
  const { paintLitresWithWaste } = calculatePaintLitres(
    totalArea,
    quoteSettings.coats,
    quoteSettings.coveragePerLitre,
    quoteSettings.wastePercent
  );
  const tins = suggestPaintTins(paintLitresWithWaste);
  const totals = calculateQuoteTotal(quoteSettings);
  const colour = getPrimaryColour(project);

  const num = (
    field: keyof typeof quoteSettings,
    value: string,
    fallback = 0
  ) => {
    updateQuoteSettings({
      [field]: parseFloat(value) || fallback,
    } as Partial<typeof quoteSettings>);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Total area" value={formatArea(totalArea)} />
        <MetricCard
          label="Paint required"
          value={formatLitres(paintLitresWithWaste)}
        />
        <MetricCard
          label="Suggested tins"
          value={`${tins.tins5L}×5L + ${tins.tins25L}×2.5L`}
        />
        <MetricCard
          label="Quote total"
          value={formatCurrency(totals.total)}
          hint="inc. VAT if enabled"
        />
      </div>

      <Card className="space-y-3">
        <h3 className="text-lg font-semibold">Project details</h3>
        <dl className="grid gap-2 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-slate-500">Client</dt>
            <dd className="font-medium">{project.clientName}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Address</dt>
            <dd className="font-medium">{project.address || "—"}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Rooms</dt>
            <dd className="font-medium">
              {project.rooms.map((r) => r.name).join(", ") || "—"}
            </dd>
          </div>
          <div>
            <dt className="text-slate-500">Colour</dt>
            <dd className="flex items-center gap-2 font-medium">
              {colour && (
                <span
                  className="inline-block h-4 w-4 rounded"
                  style={{ backgroundColor: colour.hex }}
                />
              )}
              {colour?.name || "—"}
            </dd>
          </div>
        </dl>
      </Card>

      <Card className="space-y-4">
        <h3 className="text-lg font-semibold">Materials</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {(
            [
              ["paintCost", "Paint cost (£)"],
              ["primerCost", "Primer cost (£)"],
              ["prepMaterialsCost", "Filler / prep materials (£)"],
              ["sundriesCost", "Tape / sheets / sundries (£)"],
              ["otherMaterialsCost", "Other materials (£)"],
            ] as const
          ).map(([field, label]) => (
            <div key={field}>
              <Label htmlFor={field}>{label}</Label>
              <Input
                id={field}
                type="number"
                min="0"
                step="0.01"
                value={quoteSettings[field]}
                onChange={(e) => num(field, e.target.value)}
              />
            </div>
          ))}
        </div>
        <p className="text-sm font-medium text-slate-700">
          Materials subtotal: {formatCurrency(totals.materialsTotal)}
        </p>
      </Card>

      <Card className="space-y-4">
        <h3 className="text-lg font-semibold">Labour</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="prepHours">Prep hours</Label>
            <Input
              id="prepHours"
              type="number"
              min="0"
              step="0.5"
              value={quoteSettings.prepHours}
              onChange={(e) => num("prepHours", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="paintingHours">Painting hours</Label>
            <Input
              id="paintingHours"
              type="number"
              min="0"
              step="0.5"
              value={quoteSettings.paintingHours}
              onChange={(e) => num("paintingHours", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="hourlyRate">Hourly rate (£)</Label>
            <Input
              id="hourlyRate"
              type="number"
              min="0"
              step="0.01"
              value={quoteSettings.hourlyRate}
              onChange={(e) => num("hourlyRate", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="decorators">Number of decorators</Label>
            <Input
              id="decorators"
              type="number"
              min="1"
              value={quoteSettings.decorators}
              onChange={(e) =>
                updateQuoteSettings({
                  decorators: parseInt(e.target.value) || 1,
                })
              }
            />
          </div>
        </div>
        <p className="text-sm font-medium text-slate-700">
          Labour subtotal: {formatCurrency(totals.labourTotal)}
        </p>
      </Card>

      <Card className="space-y-4">
        <h3 className="text-lg font-semibold">Quote settings</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={quoteSettings.vatEnabled}
              onChange={(e) =>
                updateQuoteSettings({ vatEnabled: e.target.checked })
              }
              className="h-4 w-4 rounded text-purple"
            />
            VAT enabled
          </label>
          <div>
            <Label htmlFor="vatPercent">VAT (%)</Label>
            <Input
              id="vatPercent"
              type="number"
              min="0"
              value={quoteSettings.vatPercent}
              onChange={(e) => num("vatPercent", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="contingencyPercent">Contingency (%)</Label>
            <Input
              id="contingencyPercent"
              type="number"
              min="0"
              value={quoteSettings.contingencyPercent}
              onChange={(e) => num("contingencyPercent", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="discount">Discount (£)</Label>
            <Input
              id="discount"
              type="number"
              min="0"
              step="0.01"
              value={quoteSettings.discount}
              onChange={(e) => num("discount", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="quoteExpiry">Quote expiry</Label>
            <Input
              id="quoteExpiry"
              type="date"
              value={project.quoteExpiry ?? ""}
              onChange={(e) => updateProject({ quoteExpiry: e.target.value })}
            />
          </div>
        </div>
      </Card>

      <Card className="space-y-2">
        <h3 className="text-lg font-semibold">Total</h3>
        <dl className="space-y-1 text-sm">
          <div className="flex justify-between">
            <dt>Subtotal</dt>
            <dd>{formatCurrency(totals.subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Contingency</dt>
            <dd>{formatCurrency(totals.contingencyAmount)}</dd>
          </div>
          {quoteSettings.discount > 0 && (
            <div className="flex justify-between text-success">
              <dt>Discount</dt>
              <dd>-{formatCurrency(quoteSettings.discount)}</dd>
            </div>
          )}
          <div className="flex justify-between">
            <dt>VAT</dt>
            <dd>{formatCurrency(totals.vatAmount)}</dd>
          </div>
          <div className="flex justify-between border-t border-border-light pt-2 text-xl font-bold">
            <dt>Total {quoteSettings.vatEnabled ? "(inc. VAT)" : ""}</dt>
            <dd className="text-purple">{formatCurrency(totals.total)}</dd>
          </div>
        </dl>
      </Card>

      <DisclaimerNote variant="warning">
        This quote is a guide until the decorator confirms site conditions,
        preparation requirements, and final materials.
      </DisclaimerNote>

      <ShareActions />
      <Button
        variant="outline"
        size="lg"
        onClick={() => window.open("/client-view", "_blank")}
      >
        Preview client view
      </Button>
    </div>
  );
}
