"use client";

import { AppShell } from "@/components/AppShell";
import { ColourPicker } from "@/components/ColourPicker";
import { ColourPreview } from "@/components/ColourPreview";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { getPrimaryColour } from "@/lib/quoteFormatter";
import type { PaintColour } from "@/lib/types";
import { useProjectStore } from "@/store/project-store";
import { Palette } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ColourPage() {
  const {
    project,
    hydrated,
    hydrate,
    currentRoomId,
    applyColourToWalls,
    colourPreviewOpacity,
    setColourPreviewOpacity,
    showColourPreview,
    setShowColourPreview,
  } = useProjectStore();
  const [selected, setSelected] = useState<PaintColour | null>(null);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (project) {
      setSelected(getPrimaryColour(project));
    }
  }, [project]);

  if (!hydrated) return null;

  const currentRoom = project?.rooms.find((r) => r.id === currentRoomId) ?? project?.rooms[0];
  const hasWalls = project?.rooms.some((r) => r.walls.length > 0);

  if (!project || !hasWalls || !currentRoom?.imageUrl) {
    return (
      <AppShell title="Choose Colour" subtitle="Select and preview paint colours">
        <EmptyState
          icon={Palette}
          title="Add walls first"
          description="Mark walls on your room photos before choosing a colour."
          action={
            <Link href="/mark-walls">
              <Button size="lg">Mark Walls</Button>
            </Link>
          }
        />
      </AppShell>
    );
  }

  const handleSelect = (colour: PaintColour) => {
    setSelected(colour);
    applyColourToWalls(colour);
  };

  return (
    <AppShell
      title="Choose Colour"
      subtitle="Select a colour and preview on the wall"
      action={
        <Link href="/quote">
          <Button size="sm">Continue to Quote</Button>
        </Link>
      }
    >
      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <ColourPicker selected={selected} onSelect={handleSelect} />
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm">
            <button
              type="button"
              onClick={() => setShowColourPreview(false)}
              className={`flex-1 rounded-lg py-2 text-sm font-medium ${
                !showColourPreview ? "bg-purple text-white" : "text-slate-600"
              }`}
            >
              Original
            </button>
            <button
              type="button"
              onClick={() => setShowColourPreview(true)}
              className={`flex-1 rounded-lg py-2 text-sm font-medium ${
                showColourPreview ? "bg-purple text-white" : "text-slate-600"
              }`}
            >
              Painted
            </button>
          </div>

          <div>
            <Label htmlFor="opacity">
              Overlay opacity: {Math.round(colourPreviewOpacity * 100)}%
            </Label>
            <input
              id="opacity"
              type="range"
              min="0.2"
              max="0.9"
              step="0.05"
              value={colourPreviewOpacity}
              onChange={(e) =>
                setColourPreviewOpacity(parseFloat(e.target.value))
              }
              className="mt-2 w-full accent-purple"
            />
          </div>

          <ColourPreview
            imageUrl={currentRoom.imageUrl}
            walls={currentRoom.walls}
            colour={selected}
            opacity={colourPreviewOpacity}
            showPreview={showColourPreview}
          />
        </div>
      </div>
    </AppShell>
  );
}
