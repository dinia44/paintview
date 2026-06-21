import { COLOURS } from "@/data/mock";
import { cn } from "@/lib/cn";
import { useAppStore } from "@/store/appStore";
import type { PaintColour } from "@/types";
import { Check, Heart } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DEMO_ROOM_PHOTO } from "@/data/mock";
import { PrimaryButton, ScreenHeader, ToastStack } from "@/components/ui";

const finishes: PaintColour["finish"][] = ["Matt", "Eggshell", "Satin"];

export function ColourScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { projects, previewMode, setPreviewMode, selectColour } = useAppStore();
  const project = projects.find((p) => p.id === id) ?? projects[0];
  const [selected, setSelected] = useState<PaintColour>(
    project?.selectedColour ?? COLOURS[0]
  );
  const [finish, setFinish] = useState<PaintColour["finish"]>(selected.finish);

  const photo = project?.roomPhotoUrl ?? DEMO_ROOM_PHOTO;
  const overlay = previewMode === "preview" ? selected.hex : "transparent";

  return (
    <div className="mx-auto min-h-[100dvh] max-w-md bg-pv-bg pb-8">
      <ScreenHeader
        title="Colour Preview"
        onBack={() => navigate(`/room/${id ?? project?.id}`)}
        right={
          <button type="button" aria-label="Favourite" className="flex h-10 w-10 items-center justify-center rounded-full bg-pv-surface shadow-sm">
            <Heart className="h-5 w-5 text-pv-danger" />
          </button>
        }
      />

      <div className="mx-4 flex rounded-2xl bg-pv-surface p-1 shadow-sm">
        {(["original", "preview"] as const).map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => setPreviewMode(mode)}
            className={cn(
              "flex-1 rounded-xl py-2.5 text-sm font-semibold capitalize",
              previewMode === mode ? "bg-pv-lavender text-pv-purple-dark" : "text-pv-muted"
            )}
          >
            {mode}
          </button>
        ))}
      </div>

      <div className="relative mx-4 mt-4 overflow-hidden rounded-[24px] border border-pv-border shadow-pv">
        <img src={photo} alt="Room preview" className="aspect-[4/3] w-full object-cover" />
        {previewMode === "preview" && (
          <div
            className="absolute inset-0 mix-blend-multiply opacity-55"
            style={{ backgroundColor: overlay }}
          />
        )}
      </div>

      <div className="mt-5 flex gap-3 overflow-x-auto px-4 pb-2">
        {COLOURS.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => {
              setSelected(c);
              setFinish(c.finish);
            }}
            className={cn(
              "relative h-16 w-16 shrink-0 rounded-2xl border-2 shadow-sm",
              selected.id === c.id ? "border-pv-purple ring-2 ring-pv-purple/30" : "border-pv-border"
            )}
            style={{ backgroundColor: c.hex }}
            aria-label={c.name}
          >
            {selected.id === c.id && (
              <Check className="absolute right-1 top-1 h-4 w-4 text-white drop-shadow" />
            )}
          </button>
        ))}
      </div>

      <div className="mx-4 mt-4 flex items-center gap-4 rounded-[22px] border border-pv-border bg-pv-surface p-4 shadow-sm">
        <div
          className="h-14 w-14 shrink-0 rounded-2xl border border-pv-border"
          style={{ backgroundColor: selected.hex }}
        />
        <div className="flex-1">
          <p className="font-bold">{selected.name}</p>
          <p className="text-sm text-pv-muted">
            {selected.brand} · {selected.code}
          </p>
        </div>
        <Heart className="h-5 w-5 text-pv-muted" />
      </div>

      <div className="mx-4 mt-4">
        <p className="mb-2 text-sm font-semibold text-pv-muted">Finish</p>
        <div className="flex gap-2">
          {finishes.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFinish(f)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-semibold",
                finish === f ? "bg-pv-charcoal text-white" : "bg-pv-surface border border-pv-border"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-4 mt-6">
        <PrimaryButton
          onClick={() => {
            selectColour(selected, finish);
            navigate(`/quote/${id ?? project?.id}`);
          }}
        >
          Use this colour
        </PrimaryButton>
      </div>
      <ToastStack />
    </div>
  );
}
