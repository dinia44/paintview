import { BottomSheet, PrimaryButton, ScreenHeader, SecondaryButton, ToastStack } from "@/components/ui";
import { DEMO_ROOM_PHOTO } from "@/data/mock";
import { useAppStore } from "@/store/appStore";
import { HelpCircle, Zap, ZapOff } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export function ScanScreen() {
  const navigate = useNavigate();
  const { scanPoints, scanWall, setScanPoints, confirmScanWall, createFromScan, addToast } =
    useAppStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [photo, setPhoto] = useState(DEMO_ROOM_PHOTO);
  const [flashOn, setFlashOn] = useState(false);

  const area = Math.max(0, scanWall.widthM * scanWall.heightM).toFixed(2);

  const toNorm = useCallback((clientX: number, clientY: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0.5, y: 0.5 };
    return {
      x: Math.min(1, Math.max(0, (clientX - rect.left) / rect.width)),
      y: Math.min(1, Math.max(0, (clientY - rect.top) / rect.height)),
    };
  }, []);

  const handleConfirm = () => {
    confirmScanWall();
    const id = createFromScan();
    navigate(`/room/${id}`);
  };

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
          setScanPoints(next);
        }}
        onPointerUp={() => setDragIdx(null)}
        onClick={(e) => {
          if ((e.target as HTMLElement).dataset.handle) return;
          setScanPoints([...scanPoints, toNorm(e.clientX, e.clientY)]);
        }}
      >
        <img src={photo} alt="Room" className="h-full w-full object-cover" draggable={false} />
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <polygon
            points={scanPoints.map((p) => `${p.x * 100},${p.y * 100}`).join(" ")}
            fill="rgba(99, 102, 241, 0.18)"
            stroke="#6366F1"
            strokeWidth="0.45"
          />
          {scanPoints.map((p, i) => (
            <g key={i}>
              <circle
                cx={p.x * 100}
                cy={p.y * 100}
                r="3.5"
                fill="rgba(99,102,241,0.35)"
                data-handle="1"
              />
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
        <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/50 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
          Tap the corners of the wall
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
              r.onload = () => setPhoto(r.result as string);
              r.readAsDataURL(f);
            }}
          />
          Photo
        </label>
        <button
          type="button"
          aria-label="Confirm capture"
          onClick={handleConfirm}
          className="flex h-[72px] w-[72px] items-center justify-center rounded-full border-[5px] border-white bg-transparent shadow-lg"
        >
          <span className="h-14 w-14 rounded-full bg-pv-purple" />
        </button>
        <div className="h-11 w-11" />
      </div>

      <BottomSheet className="relative z-30">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-lg font-bold">Wall detected</h3>
          <svg viewBox="0 0 48 48" className="h-10 w-10 text-pv-purple" aria-hidden>
            <rect x="8" y="8" width="32" height="32" rx="4" fill="currentColor" opacity="0.15" />
            <rect x="14" y="14" width="20" height="20" rx="2" fill="currentColor" opacity="0.35" />
          </svg>
        </div>
        <p className="text-xl font-bold">
          {scanWall.widthM.toFixed(2)}m × {scanWall.heightM.toFixed(2)}m
        </p>
        <p className="mt-1 text-pv-muted">{area} m² total area</p>
        <p className="mt-2 text-xs text-pv-muted">Stand facing the wall.</p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <SecondaryButton onClick={() => addToast("Drag the corner points to adjust.")}>
            Adjust
          </SecondaryButton>
          <PrimaryButton onClick={handleConfirm}>Confirm</PrimaryButton>
        </div>
      </BottomSheet>
      <ToastStack />
    </div>
  );
}
