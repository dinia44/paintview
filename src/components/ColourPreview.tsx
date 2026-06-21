"use client";

import { DisclaimerNote } from "@/components/DisclaimerNote";
import type { PaintColour, Point, Wall } from "@/lib/types";
import Image from "next/image";

type ColourPreviewProps = {
  imageUrl: string;
  walls: Wall[];
  colour: PaintColour | null;
  opacity: number;
  showPreview: boolean;
};

export function ColourPreview({
  imageUrl,
  walls,
  colour,
  opacity,
  showPreview,
}: ColourPreviewProps) {
  const polygons = walls.filter((w) => w.polygon.length >= 3);

  return (
    <div className="space-y-4">
      <div className="relative aspect-[4/3] overflow-hidden rounded-card border border-border bg-surface-soft">
        <Image
          src={imageUrl}
          alt="Room colour preview"
          fill
          className="object-cover"
          unoptimized
        />
        {showPreview && colour && (
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {polygons.map((wall) => (
              <polygon
                key={wall.id}
                points={wall.polygon.map((p: Point) => `${p.x},${p.y}`).join(" ")}
                fill={colour.hex}
                fillOpacity={opacity}
                stroke={colour.hex}
                strokeWidth="0.3"
                strokeOpacity={opacity + 0.2}
              />
            ))}
          </svg>
        )}
      </div>

      {colour && (
        <div className="flex items-center gap-3 rounded-card border border-border bg-surface p-4 shadow-card">
          <span
            className="h-12 w-12 rounded-xl border border-border"
            style={{ backgroundColor: colour.hex }}
            aria-hidden
          />
          <div>
            <p className="font-semibold">{colour.name}</p>
            <p className="text-sm text-text-muted">
              {colour.brand} · {colour.code} · {colour.finish || "Matt"}
            </p>
          </div>
        </div>
      )}

      <DisclaimerNote>
        Preview colours are approximate and depend on lighting, screen
        brightness, and paint finish.
      </DisclaimerNote>
    </div>
  );
}
