import { DEMO_ROOM_PHOTO, formatGbp } from "@/data/mock";
import { PrimaryButton, ScreenHeader, SecondaryButton, ToastStack } from "@/components/ui";
import { useAppStore } from "@/store/appStore";
import { useNavigate, useParams } from "react-router-dom";

export function ClientPreviewScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const projects = useAppStore((s) => s.projects);
  const addToast = useAppStore((s) => s.addToast);
  const project = projects.find((p) => p.id === id) ?? projects[0];
  if (!project?.quote) return null;

  const decorator = project.decoratorName ?? "Parker Decorators";

  return (
    <div className="mx-auto min-h-[100dvh] max-w-md bg-pv-bg pb-8">
      <ScreenHeader title="Client view" onBack={() => navigate(`/quote/${project.id}`)} />

      <div className="mx-4 rounded-[28px] border border-pv-border bg-pv-surface p-6 shadow-pv">
        <p className="text-center text-sm font-semibold text-pv-purple">Your quote from</p>
        <h1 className="mt-1 text-center text-xl font-extrabold">{decorator}</h1>
        <p className="mt-2 text-center text-pv-muted">{project.name} · {project.clientName}</p>

        <img
          src={project.roomPhotoUrl ?? DEMO_ROOM_PHOTO}
          alt="Room"
          className="mt-5 aspect-video w-full rounded-2xl object-cover"
        />

        {project.selectedColour && (
          <div className="mt-4 flex items-center justify-center gap-2">
            <span
              className="h-8 w-8 rounded-full border border-pv-border"
              style={{ backgroundColor: project.selectedColour.hex }}
            />
            <span className="font-semibold">{project.selectedColour.name}</span>
          </div>
        )}

        <p className="mt-6 text-center text-3xl font-extrabold">{formatGbp(project.quote.total)}</p>
        <p className="text-center text-sm text-pv-muted">Including VAT · 2 coats</p>

        <ul className="mt-6 space-y-2 text-sm text-pv-muted">
          <li>✓ Surface preparation</li>
          <li>✓ Protection of floors and fittings</li>
          <li>✓ Professional painting</li>
          <li>✓ Clean working area after completion</li>
        </ul>

        <p className="mt-4 text-center text-sm text-pv-muted">Estimated start: within 2 weeks</p>
      </div>

      <div className="mx-4 mt-6 space-y-3">
        <PrimaryButton onClick={() => addToast("Quote accepted — thank you!")}>
          Accept Quote
        </PrimaryButton>
        <SecondaryButton onClick={() => addToast("We&apos;ll notify your decorator.")}>
          Ask a Question
        </SecondaryButton>
      </div>
      <ToastStack />
    </div>
  );
}
