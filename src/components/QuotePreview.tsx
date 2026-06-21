"use client";

import {
  calculatePaintLitres,
  calculateQuoteTotal,
  calculateTotalWallArea,
  formatCurrency,
  suggestPaintTins,
} from "@/lib/calculations";
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
    <div className="mx-auto max-w-2xl space-y-6 rounded-card border border-border bg-surface p-6 shadow-soft sm:p-8">
      <header className="border-b border-border pb-6 text-center">
        <p className="text-sm font-semibold text-primary">PaintView Quote</p>
        <h1 className="mt-2 text-2xl font-bold text-text-main">
          {project.decoratorName || "Your Decorator"}
        </h1>
        <p className="mt-1 text-text-muted">Prepared for {project.clientName}</p>
        {project.address && (
          <p className="text-sm text-text-muted">{project.address}</p>
        )}
        <span className="status-approved mt-3 inline-block rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-success">
          Quote ready
        </span>
      </header>

      {heroImage && (
        <div className="relative aspect-[16/10] overflow-hidden rounded-card border border-border">
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
        <div className="flex items-center gap-4 rounded-card border border-border bg-surface-soft p-4">
          <span
            className="paint-chip h-14 w-14 rounded-full border border-[#8F8F70]"
            style={{ backgroundColor: colour.hex }}
          />
          <div>
            <p className="font-semibold text-text-main">{colour.name}</p>
            <p className="text-sm text-text-muted">
              {colour.brand} · {colour.code} · {colour.finish || "Matt"}
            </p>
          </div>
        </div>
      )}

      <section>
        <h2 className="mb-3 font-semibold text-text-main">Scope of work</h2>
        <ul className="list-inside list-disc space-y-1 text-sm text-text-muted">
          <li>Prepare surfaces</li>
          <li>Protect floors and fittings</li>
          <li>Paint selected walls ({quoteSettings.coats} coats)</li>
          <li>Clean working area after completion</li>
        </ul>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-card bg-surface-soft p-4">
          <p className="text-sm text-text-muted">Total wall area</p>
          <p className="text-xl font-bold text-text-main">
            {totalArea.toFixed(2)} m²
          </p>
        </div>
        <div className="rounded-card bg-surface-soft p-4">
          <p className="text-sm text-text-muted">Paint required</p>
          <p className="text-xl font-bold text-text-main">
            {paintLitresWithWaste.toFixed(1)} L
          </p>
          <p className="text-xs text-text-muted">
            {tins.tins5L}×5L, {tins.tins25L}×2.5L
          </p>
        </div>
      </section>

      <section>
        <h2 className="mb-3 font-semibold text-text-main">Costs</h2>
        <dl className="space-y-2 text-sm text-text-main">
          <div className="flex justify-between">
            <dt className="text-text-muted">Materials</dt>
            <dd>{formatCurrency(totals.materialsTotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-text-muted">Labour</dt>
            <dd>{formatCurrency(totals.labourTotal)}</dd>
          </div>
          {totals.contingencyAmount > 0 && (
            <div className="flex justify-between">
              <dt className="text-text-muted">Contingency</dt>
              <dd>{formatCurrency(totals.contingencyAmount)}</dd>
            </div>
          )}
          <div className="flex justify-between">
            <dt className="text-text-muted">VAT</dt>
            <dd>{formatCurrency(totals.vatAmount)}</dd>
          </div>
          <div className="flex justify-between border-t border-border pt-3">
            <dt className="quote-total text-2xl font-extrabold text-text-main">
              Total
            </dt>
            <dd className="quote-total text-2xl font-extrabold text-text-main">
              {formatCurrency(totals.total)}
            </dd>
          </div>
        </dl>
      </section>

      {project.quoteExpiry && (
        <p className="text-sm text-text-muted">
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
          <h2 className="mb-2 font-semibold text-text-main">Notes</h2>
          <p className="text-sm text-text-muted">{project.notes}</p>
        </section>
      )}

      <footer className="border-t border-border pt-4 text-xs leading-relaxed text-text-muted">
        Colour previews are approximate and may vary due to lighting, screen
        settings, surface texture, and paint finish. This quote is a guide until
        the decorator confirms site conditions, preparation requirements, and
        final materials.
      </footer>
    </div>
  );
}
