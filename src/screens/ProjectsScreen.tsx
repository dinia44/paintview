import { ProjectListItem } from "@/components/cards";
import { BottomNav } from "@/components/BottomNav";
import { ToastStack } from "@/components/ui";
import { formatGbp, formatRelativeDate, statusLabel } from "@/data/mock";
import { useAppStore } from "@/store/appStore";
import { useNavigate } from "react-router-dom";

export function ProjectsScreen() {
  const navigate = useNavigate();
  const { projects, setActiveProject } = useAppStore();

  return (
    <div className="mx-auto min-h-[100dvh] max-w-md bg-pv-bg pb-28">
      <header className="px-4 pt-[max(12px,env(safe-area-inset-top))]">
        <h1 className="text-2xl font-extrabold">Projects</h1>
        <p className="text-pv-muted">Your rooms and quotes</p>
      </header>
      <div className="mt-4 space-y-2 px-4">
        {projects.map((p) => (
          <ProjectListItem
            key={p.id}
            name={p.name}
            status={statusLabel(p.status)}
            amount={formatGbp(p.quote?.total ?? 0)}
            date={formatRelativeDate(p.updatedAt)}
            onClick={() => {
              setActiveProject(p.id);
              navigate(`/room/${p.id}`);
            }}
          />
        ))}
      </div>
      <BottomNav />
      <ToastStack />
    </div>
  );
}
