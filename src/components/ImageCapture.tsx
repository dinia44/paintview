"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { DisclaimerNote } from "@/components/DisclaimerNote";
import { readFileAsDataUrl } from "@/lib/utils";
import { useProjectStore } from "@/store/project-store";
import { Camera, ImagePlus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

export function ImageCapture() {
  const router = useRouter();
  const { project, addRoom, updateRoom, currentRoomId } = useProjectStore();
  const [roomName, setRoomName] = useState("Living Room");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentRoom = project?.rooms.find((r) => r.id === currentRoomId);

  const handleFile = async (file: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }
    setError(null);
    const dataUrl = await readFileAsDataUrl(file);
    setPreviewUrl(dataUrl);
  };

  const saveAndContinue = () => {
    if (!project) {
      setError("Create a project first.");
      return;
    }
    if (!previewUrl) {
      setError("Please take or upload a room photo.");
      return;
    }
    if (!roomName.trim()) {
      setError("Please enter a room name.");
      return;
    }

    if (currentRoom) {
      updateRoom(currentRoom.id, { name: roomName, imageUrl: previewUrl });
    } else {
      addRoom(roomName, previewUrl);
    }
    router.push("/mark-walls");
  };

  const addAnotherRoom = () => {
    if (!previewUrl || !roomName.trim()) {
      setError("Add a photo and room name first.");
      return;
    }
    if (currentRoom) {
      updateRoom(currentRoom.id, { name: roomName, imageUrl: previewUrl });
    } else {
      addRoom(roomName, previewUrl);
    }
    setRoomName("");
    setPreviewUrl(null);
    setError(null);
  };

  return (
    <div className="space-y-6">
      <Card className="space-y-4">
        <div>
          <Label htmlFor="roomName">Room name</Label>
          <Input
            id="roomName"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            placeholder="Living Room, Bedroom 1..."
          />
        </div>

        <DisclaimerNote>
          Take a straight-on photo of the wall where possible. Good lighting
          helps. For accurate quotes, you will confirm the wall measurements
          manually.
        </DisclaimerNote>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
          aria-label="Capture or upload room photo"
        />

        {previewUrl ? (
          <div className="relative overflow-hidden rounded-2xl border border-border-light">
            <Image
              src={previewUrl}
              alt="Room preview"
              width={800}
              height={600}
              className="h-auto w-full object-cover"
              unoptimized
            />
            <button
              type="button"
              onClick={() => setPreviewUrl(null)}
              className="absolute right-3 top-3 rounded-full bg-black/60 p-2 text-white"
              aria-label="Remove photo"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              type="button"
              size="lg"
              onClick={() => inputRef.current?.click()}
              className="flex-1"
            >
              <Camera className="h-5 w-5" />
              Take Photo
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => inputRef.current?.click()}
              className="flex-1"
            >
              <ImagePlus className="h-5 w-5" />
              Upload Photo
            </Button>
          </div>
        )}

        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
      </Card>

      {project && project.rooms.length > 0 && (
        <Card>
          <h3 className="mb-3 font-semibold">Saved rooms</h3>
          <ul className="space-y-2">
            {project.rooms.map((room) => (
              <li
                key={room.id}
                className="flex items-center justify-between rounded-xl bg-panel-soft px-4 py-3 text-sm"
              >
                <span>{room.name}</span>
                <span className="text-muted-light">
                  {room.walls.length} wall{room.walls.length !== 1 ? "s" : ""}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button size="lg" onClick={saveAndContinue}>
          Continue to Wall Marking
        </Button>
        <Button variant="outline" size="lg" onClick={addAnotherRoom}>
          Save & Add Another Room
        </Button>
      </div>
    </div>
  );
}
