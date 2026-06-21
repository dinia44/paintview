import { ActionCard, ProjectListItem } from "@/components/cards";
import { BottomNav } from "@/components/BottomNav";
import { ToastStack } from "@/components/ui";
import { DEMO_ROOM_PHOTO, formatGbp, formatRelativeDate, statusLabel } from "@/data/mock";
import { useAppStore } from "@/store/appStore";
import { Bell, Camera, FileText, FolderOpen, Menu } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export function HomeScreen() {
  const navigate = useNavigate();
  const userName = useAppStore((s) => s.userName);
  const projects = useAppStore((s) => s.projects);
  const setActiveProject = useAppStore((s) => s.setActiveProject);

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="mx-auto min-h-[100dvh] max-w-md bg-pv-bg pb-28">
      <header className="flex items-center justify-between px-4 pt-[max(12px,env(safe-area-inset-top))]">
        <button type="button" aria-label="Menu" className="flex h-10 w-10 items-center justify-center rounded-full bg-pv-surface shadow-sm">
          <Menu className="h-5 w-5" />
        </button>
        <button type="button" aria-label="Notifications" className="flex h-10 w-10 items-center justify-center rounded-full bg-pv-surface shadow-sm">
          <Bell className="h-5 w-5" />
        </button>
      </header>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-4 pt-2"
      >
        <h1 className="text-2xl font-extrabold tracking-tight">
          {greeting}, {userName} 👋
        </h1>
        <p className="mt-1 text-pv-muted">Let&apos;s make today productive.</p>
      </motion.div>

      <div className="mt-6 space-y-3 px-4">
        <ActionCard
          title="Scan a Room"
          subtitle="Measure walls in seconds"
          tone="lavender"
          icon={Camera}
          onClick={() => navigate("/scan")}
        />
        <ActionCard
          title="Create Quote"
          subtitle="Build a professional estimate"
          tone="sage"
          icon={FileText}
          onClick={() => {
            setActiveProject(projects[0]?.id ?? null);
            navigate(`/quote/${projects[0]?.id ?? "p1"}`);
          }}
        />
        <ActionCard
          title="Projects"
          subtitle="Manage your rooms and quotes"
          tone="beige"
          icon={FolderOpen}
          onClick={() => navigate("/projects")}
        />
      </div>

      <section className="mt-8 px-4">
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-pv-muted">
          Recent projects
        </h2>
        <div className="space-y-2">
          {projects.slice(0, 3).map((p) => (
            <ProjectListItem
              key={p.id}
              name={p.name}
              status={statusLabel(p.status)}
              amount={formatGbp(p.quote?.total ?? 0)}
              date={formatRelativeDate(p.updatedAt)}
              thumbnail={p.roomPhotoUrl ?? DEMO_ROOM_PHOTO}
              onClick={() => {
                setActiveProject(p.id);
                navigate(`/room/${p.id}`);
              }}
            />
          ))}
        </div>
      </section>

      <BottomNav />
      <ToastStack />
    </div>
  );
}
