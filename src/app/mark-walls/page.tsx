"use client";

import { AppShell } from "@/components/AppShell";
import { EmptyState } from "@/components/EmptyState";
import { WallMarker } from "@/components/WallMarker";
import { WallSummaryCard } from "@/components/WallSummaryCard";
import { Button } from "@/components/ui/Button";
import { useProjectStore } from "@/store/project-store";
import { Shapes } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function MarkWallsPage() {
  const router = useRouter();
  const {
    project,
    hydrated,
    hydrate,
    currentRoomId,
    setCurrentRoom,
    currentWallId,
    setCurrentWall,
  } = useProjectStore();
  const [addingNew, setAddingNew] = useState(false);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (project?.rooms.length && !currentRoomId) {
      setCurrentRoom(project.rooms[0].id);
    }
  }, [project, currentRoomId, setCurrentRoom]);

  if (!hydrated) return null;

  if (!project || project.rooms.length === 0) {
    return (
      <AppShell title="Mark Walls" subtitle="Outline walls on your room photo">
        <EmptyState
          icon={Shapes}
          title="No room photos yet"
          description="Capture a room photo first, then mark the walls you want painted."
          action={
            <Link href="/capture">
              <Button size="lg">Go to Capture</Button>
            </Link>
          }
        />
      </AppShell>
    );
  }

  const currentRoom = project.rooms.find((r) => r.id === currentRoomId);
  const imageUrl = currentRoom?.imageUrl;

  return (
    <AppShell
      title="Mark Walls"
      subtitle={currentRoom?.name ?? "Select a room"}
    >
      <div className="mb-6 flex flex-wrap gap-2">
        {project.rooms.map((room) => (
          <button
            key={room.id}
            type="button"
            onClick={() => {
              setCurrentRoom(room.id);
              setCurrentWall(null);
              setAddingNew(false);
            }}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              room.id === currentRoomId
                ? "bg-primary text-white shadow-[0_8px_18px_rgba(124,58,237,0.22)]"
                : "border border-border bg-surface text-text-muted hover:bg-surface-soft"
            }`}
          >
            {room.name}
          </button>
        ))}
      </div>

      {currentRoom && currentRoom.walls.length > 0 && (
        <div className="mb-6 space-y-3">
          <h3 className="font-semibold">Saved walls</h3>
          {currentRoom.walls.map((wall) => (
            <WallSummaryCard
              key={wall.id}
              wall={wall}
              onEdit={() => {
                setCurrentWall(wall.id);
                setAddingNew(false);
              }}
            />
          ))}
        </div>
      )}

      {imageUrl && (addingNew || currentWallId || currentRoom.walls.length === 0) ? (
        <WallMarker
          imageUrl={imageUrl}
          roomId={currentRoom!.id}
          existingWallId={currentWallId ?? undefined}
          onSaved={() => {
            setCurrentWall(null);
            setAddingNew(false);
          }}
        />
      ) : (
        imageUrl && (
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button size="lg" onClick={() => setAddingNew(true)}>
              Add Another Wall
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => router.push("/measurements")}
            >
              Continue to Measurements
            </Button>
          </div>
        )
      )}
    </AppShell>
  );
}
