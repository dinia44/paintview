import { BottomSheet, PrimaryButton, ScreenHeader, SecondaryButton, ToastStack } from "@/components/ui";
import { DEMO_ROOM_PHOTO } from "@/data/mock";
import { formatM, midpoint, orderCorners } from "@/lib/measurement";
import { useAppStore } from "@/store/appStore";
import { HelpCircle, Ruler, Zap, ZapOff } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export function ScanScreen() {
  const navigate = useNavigate();
  const {
    scanPoints,
    scanWall,
    scanPhotoUrl,
    referenceSide,
    referenceMeters,
    setScanPoints,
    setScanPhotoUrl,
    setReference,
    recalcScanWall,
    confirmScanWall,
    createFromScan,
    addToast,
  } = useAppStore();

  const containerRef = useRef<HTMLDivElement>(null);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [flashOn, setFlashOn] = useState(false);
  const [measuring, setMeasuring] = useState(false);

  const photo = scanPhotoUrl || DEMO_ROOM_PHOTO;
  const area = Math.max(0, scanWall.widthM * scanWall.heightM).toFixed(2);
  const hasQuad = scanPoints.length >= 4;
  const corners = hasQuad ? orderCorners(scanPoints) : null;

  useEffect(() => {
    recalcScanWall();
  }, [recalcScanWall]);

  const toNorm = useCallback((clientX: number, clientY: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0.5, y: 0.5 };
    return {
      x: Math.min(1, Math.max(0, (clientX - rect.left) / rect.width)),
      y: Math.min(1, Math.max(0, (clientY - rect.top) / rect.height)),
    };
  }, []);

  const ensureFourCorners = (points: { x: number; y: number }[]) => {
    if (points.length >= 4) return points.slice(0, 4);
    const defaults = [
      { x: 0.08, y: 0.12 },
      { x: 0.92, y: 0.12 },
      { x: 0.92, y: 0.78 },
      { x: 0.08, y: 0.78 },
    ];
    return defaults.slice(0, Math.max(4, points.length));
  };

  const handleConfirm = () => {
    setMeasuring(true);
    confirmScanWall();
    setTimeout(() => {
      setMeasuring(false);
      const id = createFromScan();
      navigate(`/room/${id}`);
    }, 600);
  };

  const widthLabel = formatM(scanWall.widthM);
  const heightLabel = formatM(scanWall.heightM);

  return (
    <div className="relative mx-auto flex min-h-[100dvh] max-w-md flex-col bg-black">
      <div className="absolute inset-x-0 top-0 z-20 bg-gradient-to-b from-black/50 to-transparent">
        <ScreenHeader
          dark
          title="Scan Room"
          onBack={() => navigate("/")}
          right={
            <button type="button" aria-label="Help" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white">
              <HelpCircle className="h-5 w-5" />
            </button>
          }
        />
      </div>

      <div
        ref={containerRef}
        className="relative flex-1 touch-none"
        onPointerMove={(e) => {
          if (dragIdx === null) return;
          const p = toNorm(e.clientX, e.clientY);
          const next = [...scanPoints];
          next[dragIdx] = p;
          setScanPoints(ensureFourCorners(next));
        }}
        onPointerUp={() => setDragIdx(null)}
        onClick={(e) => {
          if ((e.target as HTMLElement).dataset.handle) return;
          if (scanPoints.length < 4) {
            const next = [...scanPoints, toNorm(e.clientX, e.clientY)];
            setScanPoints(next.length >= 4 ? ensureFourCorners(next) : next);
          }
        }}
      >
        <img src={photo} alt="Room" className="h-full w-full object-cover" draggable={false} />

        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {hasQuad && corners && (
            <>
              <polygon
                points={corners.map((p) => `${p.x * 100},${p.y * 100}`).join(" ")}
                fill="rgba(99, 102, 241, 0.12)"
                stroke="#6366F1"
                strokeWidth="0.35"
              />
              {/* Width guide (top edge) */}
              <line
                x1={corners[0].x * 100}
                y1={corners[0].y * 100 - 3}
                x2={corners[1].x * 100}
                y2={corners[1].y * 100 - 3}
                stroke="#6366F1"
                strokeWidth="0.25"
                strokeDasharray="1 0.8"
              />
              {/* Height guide (left edge) */}
              <line
                x1={corners[0].x * 100 - 3}
                y1={corners[0].y * 100}
                x2={corners[3].x * 100 - 3}
                y2={corners[3].y * 100}
                stroke="#6366F1"
                strokeWidth="0.25"
                strokeDasharray="1 0.8"
              />
              {/* Dimension labels */}
              <rect
                x={midpoint(corners[0], corners[1]).x * 100 - 8}
                y={corners[0].y * 100 - 8}
                width="16"
                height="4.5"
                rx="2"
                fill="rgba(0,0,0,0.65)"
              />
              <text
                x={midpoint(corners[0], corners[1]).x * 100}
                y={corners[0].y * 100 - 5}
                textAnchor="middle"
                fill="white"
                fontSize="2.8"
                fontWeight="600"
              >
                {widthLabel}
              </text>
              <rect
                x={corners[0].x * 100 - 14}
                y={midpoint(corners[0], corners[3]).y * 100 - 2.2}
                width="12"
                height="4.5"
                rx="2"
                fill="rgba(0,0,0,0.65)"
              />
              <text
                x={corners[0].x * 100 - 8}
                y={midpoint(corners[0], corners[3]).y * 100 + 0.5}
                textAnchor="middle"
                fill="white"
                fontSize="2.8"
                fontWeight="600"
              >
                {heightLabel}
              </text>
            </>
          )}
          {scanPoints.map((p, i) => (
            <g key={i}>
              <circle cx={p.x * 100} cy={p.y * 100} r="3.5" fill="rgba(99,102,241,0.4)" data-handle="1" />
              <circle
                cx={p.x * 100}
                cy={p.y * 100}
                r="2"
                fill="#fff"
                stroke="#6366F1"
                strokeWidth="0.6"
                data-handle="1"
                className="cursor-grab"
                onPointerDown={(e) => {
                  e.stopPropagation();
                  setDragIdx(i);
                }}
              />
            </g>
          ))}
        </svg>

        <p className="absolute left-1/2 top-[42%] max-w-[85%] -translate-x-1/2 rounded-full bg-black/50 px-4 py-2 text-center text-sm font-medium text-white backdrop-blur-sm">
          {scanPoints.length < 4
            ? `Tap corner ${scanPoints.length + 1} of 4`
            : "Drag corners to match the wall edges"}
        </p>
      </div>

      <div className="absolute bottom-44 left-0 right-0 z-20 flex items-center justify-between px-8">
        <button
          type="button"
          aria-label="Toggle flash"
          onClick={() => setFlashOn(!flashOn)}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm"
        >
          {flashOn ? <Zap className="h-5 w-5" /> : <ZapOff className="h-5 w-5" />}
        </button>
        <label className="cursor-pointer rounded-full bg-black/40 px-3 py-2 text-xs font-semibold text-white backdrop-blur-sm">
          <input
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              const r = new FileReader();
              r.onload = () => setScanPhotoUrl(r.result as string);
              r.readAsDataURL(f);
            }}
          />
          Photo
        </label>
        <button
          type="button"
          aria-label="Confirm capture"
          onClick={handleConfirm}
          disabled={!hasQuad}
          className="flex h-[72px] w-[72px] items-center justify-center rounded-full border-[5px] border-white bg-transparent shadow-lg disabled:opacity-40"
        >
          <span className="h-14 w-14 rounded-full bg-pv-purple" />
        </button>
        <div className="h-11 w-11" />
      </div>

      <BottomSheet className="relative z-30">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-lg font-bold">
            {measuring ? "Measuring…" : hasQuad ? "Wall measured" : "Place wall corners"}
          </h3>
          <Ruler className="h-6 w-6 text-pv-purple" />
        </div>

        {hasQuad ? (
          <>
            <p className="text-xl font-bold">
              {scanWall.widthM.toFixed(2)}m × {scanWall.heightM.toFixed(2)}m
            </p>
            <p className="mt-1 text-pv-muted">{area} m² total area</p>
          </>
        ) : (
          <p className="text-pv-muted">Tap all four corners of the wall in the photo.</p>
        )}

        <div className="mt-4 rounded-xl bg-pv-surface-soft p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-pv-muted">
            Calibrate with one real measurement
          </p>
          <p className="mt-1 text-xs text-pv-muted">
            Like iPhone Measure — enter a dimension you know (e.g. ceiling height) and we calculate the rest from the photo.
          </p>
          <div className="mt-3 flex gap-2">
            <select
              value={referenceSide}
              onChange={(e) =>
                setReference(e.target.value as "width" | "height", referenceMeters)
              }
              className="rounded-lg border border-pv-border bg-pv-surface px-3 py-2 text-sm font-medium"
            >
              <option value="height">Height</option>
              <option value="width">Width</option>
            </select>
            <input
              type="number"
              step="0.01"
              min="0.5"
              max="20"
              value={referenceMeters}
              onChange={(e) =>
                setReference(referenceSide, parseFloat(e.target.value) || referenceMeters)
              }
              className="flex-1 rounded-lg border border-pv-border bg-pv-surface px-3 py-2 text-sm font-semibold"
            />
            <span className="self-center text-sm text-pv-muted">m</span>
          </div>
        </div>

        <p className="mt-2 text-xs text-pv-muted">
          Guided measurement from your photo — not automatic LiDAR. Confirm with a tape measure for quotes.
        </p>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <SecondaryButton onClick={() => addToast("Drag the purple corner points to adjust.")}>
            Adjust
          </SecondaryButton>
          <PrimaryButton onClick={handleConfirm} disabled={!hasQuad}>
            Confirm
          </PrimaryButton>
        </div>
      </BottomSheet>
      <ToastStack />
    </div>
  );
}
