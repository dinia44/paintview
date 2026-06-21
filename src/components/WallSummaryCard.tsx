import { calculateWallArea } from "@/lib/calculations";
import type { Wall } from "@/lib/types";

type WallSummaryCardProps = {
  wall: Wall;
  onEdit?: () => void;
};

export function WallSummaryCard({ wall, onEdit }: WallSummaryCardProps) {
  const { grossAreaM2, netAreaM2 } = calculateWallArea(wall);

  return (
    <div className="rounded-card border border-border bg-surface p-4 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="font-semibold text-text-main">{wall.name}</h4>
          <p className="mt-1 text-sm text-text-muted">
            {wall.widthM.toFixed(2)}m × {wall.heightM.toFixed(2)}m
          </p>
        </div>
        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="text-sm font-semibold text-primary hover:text-primary-dark hover:underline"
          >
            Edit
          </button>
        )}
      </div>
      <dl className="mt-3 grid grid-cols-3 gap-2 text-sm">
        <div>
          <dt className="text-text-muted">Gross</dt>
          <dd className="font-medium text-text-main">
            {grossAreaM2.toFixed(2)} m²
          </dd>
        </div>
        <div>
          <dt className="text-text-muted">Deductions</dt>
          <dd className="font-medium text-text-main">
            {wall.deductionM2.toFixed(2)} m²
          </dd>
        </div>
        <div>
          <dt className="text-text-muted">Net</dt>
          <dd className="font-semibold text-accent">{netAreaM2.toFixed(2)} m²</dd>
        </div>
      </dl>
      {wall.colour && (
        <div className="mt-3 flex items-center gap-2 text-sm">
          <span
            className="paint-chip h-5 w-5 rounded-full border border-[#8F8F70]"
            style={{ backgroundColor: wall.colour.hex }}
            aria-hidden
          />
          <span className="text-text-main">
            {wall.colour.name} ({wall.colour.code})
          </span>
        </div>
      )}
    </div>
  );
}
