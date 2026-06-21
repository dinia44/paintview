import { RoomModel3D } from "@/components/RoomModel3D";
import { MetricCard, PrimaryButton, ScreenHeader, ToastStack } from "@/components/ui";
import { useAppStore } from "@/store/appStore";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export function RoomViewScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const projects = useAppStore((s) => s.projects);
  const setActiveProject = useAppStore((s) => s.setActiveProject);
  const [tab, setTab] = useState<"summary" | "walls" | "details">("summary");

  const project = projects.find((p) => p.id === id) ?? projects[0];
  if (!project) return null;

  const colour = project.selectedColour?.hex ?? "#A8B5A1";

  return (
    <div className="mx-auto min-h-[100dvh] max-w-md bg-pv-bg pb-8">
      <ScreenHeader
        title="3D Room View"
        onBack={() => navigate("/")}
        right={
          <button type="button" aria-label="Menu" className="flex h-10 w-10 items-center justify-center rounded-full bg-pv-surface shadow-sm">
            <MoreHorizontal className="h-5 w-5" />
          </button>
        }
      />

      <div className="px-4">
        <RoomModel3D wallColour={colour} />
        <div className="mt-4 flex gap-2">
          <button type="button" className="rounded-full bg-pv-surface px-4 py-2 text-sm font-semibold shadow-sm">
            Rotate
          </button>
          <button type="button" className="rounded-full bg-pv-lavender px-4 py-2 text-sm font-semibold text-pv-purple-dark">
            View
          </button>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <MetricCard label="Total wall area" value={`${project.totalWallAreaM2.toFixed(2)} m²`} />
          <MetricCard
            label="Paint needed"
            value={`${project.paintNeededLitres.toFixed(1)} L`}
            hint={`(${project.coats} coats)`}
          />
        </div>

        <div className="mt-6 flex gap-2 border-b border-pv-border">
          {(["summary", "walls", "details"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`px-3 pb-2 text-sm font-semibold capitalize ${
                tab === t ? "border-b-2 border-pv-purple text-pv-purple" : "text-pv-muted"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="mt-4 rounded-[22px] border border-pv-border bg-pv-surface p-4 shadow-sm">
          {tab === "summary" && (
            <p className="text-sm text-pv-muted leading-relaxed">
              {project.walls.length} wall(s) measured. Preview colour and build your quote next.
            </p>
          )}
          {tab === "walls" &&
            project.walls.map((w) => (
              <div key={w.id} className="flex justify-between border-b border-pv-border py-2 last:border-0">
                <span>{w.label}</span>
                <span className="font-semibold">{w.areaM2.toFixed(2)} m²</span>
              </div>
            ))}
          {tab === "details" && (
            <p className="text-sm text-pv-muted">Reference: {project.quoteRef ?? "—"}</p>
          )}
        </div>

        <div className="mt-6">
          <PrimaryButton
            onClick={() => {
              setActiveProject(project.id);
              navigate(`/colour/${project.id}`);
            }}
          >
            Preview colour
          </PrimaryButton>
        </div>
      </div>
      <ToastStack />
    </div>
  );
}
