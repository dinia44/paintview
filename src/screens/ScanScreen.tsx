import { BottomSheet, PrimaryButton, ScreenHeader, SecondaryButton, ToastStack } from "@/components/ui";
import { DEMO_ROOM_PHOTO } from "@/data/mock";
import { useAppStore } from "@/store/appStore";
import { HelpCircle, Zap } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export function ScanScreen() {
  const navigate = useNavigate();
  const { scanPoints, scanWall, setScanPoints, confirmScanWall, createFromScan, addToast } =
    useAppStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [photo, setPhoto] = useState(DEMO_ROOM_PHOTO);

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
            fill="rgba(124, 77, 255, 0.2)"
            stroke="#7C4DFF"
            strokeWidth="0.4"
          />
          {scanPoints.map((p, i) => (
            <circle
              key={i}
              cx={p.x * 100}
              cy={p.y * 100}
              r="2.2"
              fill="#fff"
              stroke="#7C4DFF"
              strokeWidth="0.5"
              data-handle="1"
              className="cursor-grab"
              onPointerDown={(e) => {
                e.stopPropagation();
                setDragIdx(i);
              }}
            />
          ))}
        </svg>
        <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/45 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
          Tap the corners of the wall
        </p>
      </div>

      <div className="absolute bottom-[200px] left-4 right-4 z-10 flex justify-center gap-4">
        <label className="rounded-full bg-white/90 px-4 py-2 text-sm font-semibold shadow">
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
          Use camera
        </label>
      </div>

      <div className="absolute bottom-36 left-0 right-0 z-20 flex justify-center">
        <button
          type="button"
          aria-label="Confirm capture"
          onClick={handleConfirm}
          className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-pv-purple shadow-lg"
        >
          <Zap className="h-7 w-7 text-white" />
        </button>
      </div>

      <BottomSheet className="relative z-30">
        <div className="mb-1 flex items-center justify-between">
          <h3 className="text-lg font-bold">Wall detected</h3>
          <span className="text-2xl">🧱</span>
        </div>
        <p className="text-pv-muted">
          {scanWall.widthM.toFixed(2)}m × {scanWall.heightM.toFixed(2)}m · {area} m²
        </p>
        <p className="mt-1 text-xs text-pv-muted">Stand facing the wall. Confirm measurement.</p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <SecondaryButton onClick={() => addToast("Adjust corners on the photo above.")}>
            Adjust
          </SecondaryButton>
          <PrimaryButton onClick={handleConfirm}>Confirm</PrimaryButton>
        </div>
      </BottomSheet>
      <ToastStack />
    </div>
  );
}
