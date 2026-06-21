import { calculateWallArea } from "@/lib/calculations";
import type { Wall } from "@/lib/types";

type WallSummaryCardProps = {
  wall: Wall;
  onEdit?: () => void;
};

export function WallSummaryCard({ wall, onEdit }: WallSummaryCardProps) {
  const { grossAreaM2, netAreaM2 } = calculateWallArea(wall);

  return (
    <div className="rounded-2xl border border-border-light bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="font-semibold text-text-dark">{wall.name}</h4>
          <p className="mt-1 text-sm text-slate-600">
            {wall.widthM.toFixed(2)}m × {wall.heightM.toFixed(2)}m
          </p>
        </div>
        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="text-sm font-medium text-purple hover:underline"
          >
            Edit
          </button>
        )}
      </div>
      <dl className="mt-3 grid grid-cols-3 gap-2 text-sm">
        <div>
          <dt className="text-slate-500">Gross</dt>
          <dd className="font-medium">{grossAreaM2.toFixed(2)} m²</dd>
        </div>
        <div>
          <dt className="text-slate-500">Deductions</dt>
          <dd className="font-medium">{wall.deductionM2.toFixed(2)} m²</dd>
        </div>
        <div>
          <dt className="text-slate-500">Net</dt>
          <dd className="font-medium text-purple">{netAreaM2.toFixed(2)} m²</dd>
        </div>
      </dl>
      {wall.colour && (
        <div className="mt-3 flex items-center gap-2 text-sm">
          <span
            className="h-5 w-5 rounded-md border border-border-light"
            style={{ backgroundColor: wall.colour.hex }}
            aria-hidden
          />
          <span>
            {wall.colour.name} ({wall.colour.code})
          </span>
        </div>
      )}
    </div>
  );
}
