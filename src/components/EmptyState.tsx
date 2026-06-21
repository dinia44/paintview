import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
};

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-card border border-dashed border-border bg-surface px-6 py-16 text-center shadow-card">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-soft">
        <Icon className="h-7 w-7 text-accent" aria-hidden />
      </div>
      <h3 className="text-lg font-semibold text-text-main">{title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-text-muted">
        {description}
      </p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
