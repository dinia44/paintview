"use client";

import { AppShell } from "@/components/AppShell";
import { EmptyState } from "@/components/EmptyState";
import { PaintCalculator } from "@/components/PaintCalculator";
import { WallSummaryCard } from "@/components/WallSummaryCard";
import { Button } from "@/components/ui/Button";
import { useProjectStore } from "@/store/project-store";
import { Ruler } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function MeasurementsPage() {
  const { project, hydrated, hydrate } = useProjectStore();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  if (!hydrated) return null;

  const hasWalls = project?.rooms.some((r) => r.walls.length > 0);

  if (!project || !hasWalls) {
    return (
      <AppShell title="Measurements" subtitle="Review wall areas and paint">
        <EmptyState
          icon={Ruler}
          title="No walls marked yet"
          description="Mark at least one wall with confirmed dimensions to calculate paint."
          action={
            <Link href="/mark-walls">
              <Button size="lg">Mark Walls</Button>
            </Link>
          }
        />
      </AppShell>
    );
  }

  return (
    <AppShell
      title="Measurements"
      subtitle="Review areas and calculate paint required"
      action={
        <Link href="/colour">
          <Button size="sm">Continue to Colour</Button>
        </Link>
      }
    >
      <div className="mb-8 space-y-6">
        {project.rooms.map((room) =>
          room.walls.length > 0 ? (
            <div key={room.id}>
              <h3 className="mb-3 text-lg font-semibold">{room.name}</h3>
              <div className="space-y-3">
                {room.walls.map((wall) => (
                  <WallSummaryCard key={wall.id} wall={wall} />
                ))}
              </div>
            </div>
          ) : null
        )}
      </div>
      <PaintCalculator />
    </AppShell>
  );
}
