"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { DisclaimerNote } from "@/components/DisclaimerNote";
import { calculateWallArea } from "@/lib/calculations";
import type { Point } from "@/lib/types";
import { useProjectStore } from "@/store/project-store";
import { RotateCcw, Save } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

const DEFAULT_POLYGON: Point[] = [
  { x: 20, y: 20 },
  { x: 80, y: 20 },
  { x: 80, y: 80 },
  { x: 20, y: 80 },
];

type WallMarkerProps = {
  imageUrl: string;
  roomId: string;
  existingWallId?: string;
  onSaved?: () => void;
};

export function WallMarker({
  imageUrl,
  roomId,
  existingWallId,
  onSaved,
}: WallMarkerProps) {
  const { project, addWall, updateWall } = useProjectStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [polygon, setPolygon] = useState<Point[]>(DEFAULT_POLYGON);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [wallName, setWallName] = useState("Wall 1");
  const [widthM, setWidthM] = useState("");
  const [heightM, setHeightM] = useState("");
  const [deductionM2, setDeductionM2] = useState("0");
  const [notes, setNotes] = useState("");

  const existingWall = project?.rooms
    .find((r) => r.id === roomId)
    ?.walls.find((w) => w.id === existingWallId);

  useEffect(() => {
    if (existingWall) {
      setPolygon(existingWall.polygon);
      setWallName(existingWall.name);
      setWidthM(String(existingWall.widthM || ""));
      setHeightM(String(existingWall.heightM || ""));
      setDeductionM2(String(existingWall.deductionM2 || 0));
      setNotes(existingWall.notes ?? "");
    }
  }, [existingWall]);

  const getRelativePoint = useCallback(
    (clientX: number, clientY: number): Point | null => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return null;
      const x = ((clientX - rect.left) / rect.width) * 100;
      const y = ((clientY - rect.top) / rect.height) * 100;
      return {
        x: Math.min(100, Math.max(0, x)),
        y: Math.min(100, Math.max(0, y)),
      };
    },
    []
  );

  const handlePointerDown = (index: number) => (e: React.PointerEvent) => {
    e.preventDefault();
    (e.target as Element).setPointerCapture(e.pointerId);
    setDragIndex(index);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (dragIndex === null) return;
    const point = getRelativePoint(e.clientX, e.clientY);
    if (!point) return;
    setPolygon((prev) =>
      prev.map((p, i) => (i === dragIndex ? point : p))
    );
  };

  const handlePointerUp = () => setDragIndex(null);

  const addPoint = (e: React.MouseEvent | React.TouchEvent) => {
    if (dragIndex !== null) return;
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    const point = getRelativePoint(clientX, clientY);
    if (point) setPolygon((prev) => [...prev, point]);
  };

  const resetPolygon = () => setPolygon(DEFAULT_POLYGON);

  const saveWall = () => {
    const w = parseFloat(widthM);
    const h = parseFloat(heightM);
    const ded = parseFloat(deductionM2) || 0;

    if (!wallName.trim()) {
      alert("Please name this wall.");
      return;
    }
    if (!w || !h || w <= 0 || h <= 0) {
      alert("Please enter valid width and height in metres.");
      return;
    }
    if (polygon.length < 3) {
      alert("Mark at least 3 points to outline the wall.");
      return;
    }

    const wallData = {
      name: wallName,
      imageUrl,
      polygon,
      widthM: w,
      heightM: h,
      deductionM2: ded,
      notes: notes || undefined,
    };

    if (existingWallId) {
      updateWall(roomId, existingWallId, wallData);
    } else {
      addWall(roomId, wallData);
    }
    onSaved?.();
  };

  const previewArea =
    widthM && heightM
      ? calculateWallArea({
          id: "",
          roomId,
          name: wallName,
          imageUrl,
          polygon,
          widthM: parseFloat(widthM),
          heightM: parseFloat(heightM),
          deductionM2: parseFloat(deductionM2) || 0,
        })
      : null;

  const polygonPoints = polygon.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <div className="space-y-6">
      <DisclaimerNote>
        Tap to add corner points and drag handles to outline the wall area.
        Measurements are estimates until confirmed by the decorator.
      </DisclaimerNote>

      <Card className="overflow-hidden p-0">
        <div
          ref={containerRef}
          className="relative aspect-[4/3] w-full touch-none select-none bg-surface-soft"
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          onClick={addPoint}
        >
          <Image
            src={imageUrl}
            alt="Room for wall marking"
            fill
            className="object-cover"
            unoptimized
            draggable={false}
          />
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <polygon
              points={polygonPoints}
              fill="rgba(163, 163, 128, 0.28)"
              stroke="#A3A380"
              strokeWidth="0.55"
            />
            {polygon.map((point, index) => (
              <circle
                key={index}
                cx={point.x}
                cy={point.y}
                r="2"
                fill="#FFFFFF"
                stroke="#7C3AED"
                strokeWidth="0.45"
                style={{ filter: "drop-shadow(0 0 2px rgba(124,58,237,0.12))" }}
                className="cursor-grab active:cursor-grabbing"
                onPointerDown={handlePointerDown(index)}
                onClick={(e) => e.stopPropagation()}
              />
            ))}
          </svg>
        </div>
        <div className="flex items-center justify-between border-t border-border px-4 py-3 bg-surface">
          <p className="text-sm text-text-muted">
            {polygon.length} points — tap image to add, drag to adjust
          </p>
          <Button variant="ghost" size="sm" onClick={resetPolygon}>
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>
      </Card>

      <Card className="space-y-4">
        <div>
          <Label htmlFor="wallName">Wall name</Label>
          <Input
            id="wallName"
            value={wallName}
            onChange={(e) => setWallName(e.target.value)}
            placeholder="Wall 1, Feature Wall..."
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="widthM">Width (m)</Label>
            <Input
              id="widthM"
              type="number"
              min="0"
              step="0.01"
              value={widthM}
              onChange={(e) => setWidthM(e.target.value)}
              placeholder="3.42"
            />
          </div>
          <div>
            <Label htmlFor="heightM">Height (m)</Label>
            <Input
              id="heightM"
              type="number"
              min="0"
              step="0.01"
              value={heightM}
              onChange={(e) => setHeightM(e.target.value)}
              placeholder="2.60"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="deductionM2">Deductions for doors/windows (m²)</Label>
          <Input
            id="deductionM2"
            type="number"
            min="0"
            step="0.01"
            value={deductionM2}
            onChange={(e) => setDeductionM2(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="wallNotes">Notes</Label>
          <Input
            id="wallNotes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Radiator, textured wall..."
          />
        </div>

        {previewArea && (
          <div className="rounded-card bg-surface-soft px-4 py-3 text-sm">
            <p>
              Gross area: <strong>{previewArea.grossAreaM2.toFixed(2)} m²</strong>
            </p>
            <p>
              Net area: <strong>{previewArea.netAreaM2.toFixed(2)} m²</strong>
            </p>
          </div>
        )}

        <Button size="lg" onClick={saveWall}>
          <Save className="h-5 w-5" />
          Save Wall
        </Button>
      </Card>
    </div>
  );
}
