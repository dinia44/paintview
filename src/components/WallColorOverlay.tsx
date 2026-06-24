import { orderCorners } from "@/lib/measurement";
import type { Point } from "@/lib/measurement";

const DEFAULT_WALL: Point[] = [
  { x: 0.08, y: 0.12 },
  { x: 0.92, y: 0.12 },
  { x: 0.92, y: 0.78 },
  { x: 0.08, y: 0.78 },
];

export function WallColorOverlay({
  photoUrl,
  colourHex,
  wallPoints,
  mode,
}: {
  photoUrl: string;
  colourHex: string;
  wallPoints?: Point[];
  mode: "original" | "preview";
}) {
  const points = wallPoints && wallPoints.length >= 4 ? wallPoints : DEFAULT_WALL;
  const [tl, tr, br, bl] = orderCorners(points);
  const polygon = `${tl.x * 100},${tl.y * 100} ${tr.x * 100},${tr.y * 100} ${br.x * 100},${br.y * 100} ${bl.x * 100},${bl.y * 100}`;

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden bg-pv-surface-soft">
      <img src={photoUrl} alt="Room" className="h-full w-full object-cover" draggable={false} />

      {mode === "preview" && (
        <>
          {/* Wall-only paint fill */}
          <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <clipPath id="wall-clip">
                <polygon points={polygon} />
              </clipPath>
              <filter id="paint-texture">
                <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="noise" />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.5" />
              </filter>
            </defs>
            <polygon
              points={polygon}
              fill={colourHex}
              opacity="0.72"
              style={{ mixBlendMode: "multiply" }}
            />
            <polygon
              points={polygon}
              fill={colourHex}
              opacity="0.18"
              filter="url(#paint-texture)"
            />
          </svg>

          {/* Subtle edge highlight — mimics fresh paint on plaster */}
          <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <polygon
              points={polygon}
              fill="none"
              stroke="rgba(255,255,255,0.25)"
              strokeWidth="0.15"
            />
          </svg>

          {/* Keep ceiling, floor, trim & furniture visible outside wall */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: `linear-gradient(to bottom, rgba(0,0,0,0.06) 0%, transparent 18%, transparent 82%, rgba(0,0,0,0.08) 100%)`,
            }}
          />
        </>
      )}

      {mode === "preview" && (
        <div className="absolute bottom-3 left-3 rounded-full bg-black/50 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
          Wall preview · approximate
        </div>
      )}
    </div>
  );
}
