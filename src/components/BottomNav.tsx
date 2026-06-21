import { cn } from "@/lib/cn";
import { FileText, FolderOpen, Home, Plus, User } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const tabs = [
  { path: "/", label: "Home", icon: Home },
  { path: "/projects", label: "Projects", icon: FolderOpen },
  { path: "/scan", label: "Scan", icon: Plus, center: true },
  { path: "/quotes", label: "Quotes", icon: FileText },
  { path: "/profile", label: "Profile", icon: User },
];

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav
      className="no-print fixed bottom-0 left-0 right-0 z-40 border-t border-pv-border bg-pv-surface/95 backdrop-blur-xl"
      aria-label="Main navigation"
    >
      <div className="mx-auto flex max-w-md items-end justify-around px-2 pb-[max(8px,env(safe-area-inset-bottom))] pt-2">
        {tabs.map(({ path, label, icon: Icon, center }) => {
          const active = location.pathname === path;
          if (center) {
            return (
              <button
                key={path}
                type="button"
                onClick={() => navigate("/scan")}
                aria-label="Scan a room"
                className="-mt-6 flex h-14 w-14 items-center justify-center rounded-full bg-pv-purple text-white shadow-[0_10px_24px_rgba(99,102,241,0.4)]"
              >
                <Plus className="h-7 w-7" strokeWidth={2.5} />
              </button>
            );
          }
          return (
            <button
              key={path}
              type="button"
              onClick={() => navigate(path)}
              className={cn(
                "flex min-h-[48px] min-w-[56px] flex-col items-center justify-center gap-0.5 rounded-xl px-2 text-[11px] font-semibold",
                active ? "text-pv-purple" : "text-pv-muted"
              )}
              aria-current={active ? "page" : undefined}
            >
              <Icon className="h-5 w-5" strokeWidth={active ? 2.5 : 2} />
              {label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
