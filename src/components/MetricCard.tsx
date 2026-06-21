import { ReactNode } from "react";

type MetricCardProps = {
  label: string;
  value: string;
  hint?: string;
  icon?: ReactNode;
};

export function MetricCard({ label, value, hint, icon }: MetricCardProps) {
  return (
    <div className="rounded-2xl border border-border-light bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm text-slate-500">{label}</p>
        {icon}
      </div>
      <p className="mt-1 text-2xl font-bold text-text-dark">{value}</p>
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}
