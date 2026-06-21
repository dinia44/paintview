"use client";

import { formatCurrency, calculateQuoteTotal, calculateTotalWallArea, calculatePaintLitres, suggestPaintTins } from "@/lib/calculations";
import { getPrimaryColour } from "@/lib/quoteFormatter";
import type { Project, QuoteSettings } from "@/lib/types";
import Image from "next/image";

type QuotePreviewProps = {
  project: Project;
  quoteSettings: QuoteSettings;
};

export function QuotePreview({ project, quoteSettings }: QuotePreviewProps) {
  const totals = calculateQuoteTotal(quoteSettings);
  const totalArea = calculateTotalWallArea(project.rooms);
  const { paintLitresWithWaste } = calculatePaintLitres(
    totalArea,
    quoteSettings.coats,
    quoteSettings.coveragePerLitre,
    quoteSettings.wastePercent
  );
  const tins = suggestPaintTins(paintLitresWithWaste);
  const colour = getPrimaryColour(project);
  const heroImage = project.rooms[0]?.imageUrl;

  return (
    <div className="mx-auto max-w-2xl space-y-6 rounded-3xl bg-white p-6 shadow-lg sm:p-8">
      <header className="border-b border-border-light pb-6 text-center">
        <p className="text-sm font-medium uppercase tracking-wider text-purple">
          PaintView Quote
        </p>
        <h1 className="mt-2 text-2xl font-bold">
          {project.decoratorName || "Your Decorator"}
        </h1>
        <p className="mt-1 text-slate-600">Prepared for {project.clientName}</p>
        {project.address && (
          <p className="text-sm text-slate-500">{project.address}</p>
        )}
      </header>

      {heroImage && (
        <div className="relative aspect-[16/10] overflow-hidden rounded-2xl">
          <Image
            src={heroImage}
            alt="Room preview"
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      )}

      {colour && (
        <div className="flex items-center gap-4 rounded-2xl bg-panel-soft p-4">
          <span
            className="h-14 w-14 rounded-xl border border-border-light"
            style={{ backgroundColor: colour.hex }}
          />
          <div>
            <p className="font-semibold">{colour.name}</p>
            <p className="text-sm text-slate-600">
              {colour.brand} · {colour.code} · {colour.finish || "Matt"}
            </p>
          </div>
        </div>
      )}

      <section>
        <h2 className="mb-3 font-semibold">Scope of work</h2>
        <ul className="list-inside list-disc space-y-1 text-sm text-slate-700">
          <li>Prepare surfaces</li>
          <li>Protect floors and fittings</li>
          <li>Paint selected walls ({quoteSettings.coats} coats)</li>
          <li>Clean working area after completion</li>
        </ul>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl bg-panel-soft p-4">
          <p className="text-sm text-slate-500">Total wall area</p>
          <p className="text-xl font-bold">{totalArea.toFixed(2)} m²</p>
        </div>
        <div className="rounded-xl bg-panel-soft p-4">
          <p className="text-sm text-slate-500">Paint required</p>
          <p className="text-xl font-bold">
            {paintLitresWithWaste.toFixed(1)} L
          </p>
          <p className="text-xs text-slate-500">
            {tins.tins5L}×5L, {tins.tins25L}×2.5L
          </p>
        </div>
      </section>

      <section>
        <h2 className="mb-3 font-semibold">Costs</h2>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt>Materials</dt>
            <dd>{formatCurrency(totals.materialsTotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Labour</dt>
            <dd>{formatCurrency(totals.labourTotal)}</dd>
          </div>
          {totals.contingencyAmount > 0 && (
            <div className="flex justify-between">
              <dt>Contingency</dt>
              <dd>{formatCurrency(totals.contingencyAmount)}</dd>
            </div>
          )}
          <div className="flex justify-between">
            <dt>VAT</dt>
            <dd>{formatCurrency(totals.vatAmount)}</dd>
          </div>
          <div className="flex justify-between border-t border-border-light pt-2 text-lg font-bold">
            <dt>Total</dt>
            <dd className="text-purple">{formatCurrency(totals.total)}</dd>
          </div>
        </dl>
      </section>

      {project.quoteExpiry && (
        <p className="text-sm text-slate-500">
          Valid until:{" "}
          {new Date(project.quoteExpiry).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      )}

      {project.notes && (
        <section>
          <h2 className="mb-2 font-semibold">Notes</h2>
          <p className="text-sm text-slate-600">{project.notes}</p>
        </section>
      )}

      <footer className="border-t border-border-light pt-4 text-xs text-slate-500">
        Colour previews are approximate and may vary due to lighting, screen
        settings, surface texture, and paint finish. This quote is a guide until
        the decorator confirms site conditions, preparation requirements, and
        final materials.
      </footer>
    </div>
  );
}
