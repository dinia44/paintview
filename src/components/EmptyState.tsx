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
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border-light bg-white px-6 py-16 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple/10">
        <Icon className="h-7 w-7 text-purple" aria-hidden />
      </div>
      <h3 className="text-lg font-semibold text-text-dark">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-slate-600">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
