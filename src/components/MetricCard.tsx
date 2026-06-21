import { ReactNode } from "react";

type MetricCardProps = {
  label: string;
  value: string;
  hint?: string;
  icon?: ReactNode;
  trend?: "positive" | "pending";
};

export function MetricCard({
  label,
  value,
  hint,
  icon,
  trend,
}: MetricCardProps) {
  return (
    <div className="metric-card rounded-[18px] border border-border bg-surface p-4 shadow-[0_8px_24px_rgba(31,41,51,0.05)]">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm text-text-muted">{label}</p>
        {icon}
      </div>
      <p className="mt-1 text-[1.75rem] font-bold text-text-main">{value}</p>
      {hint && (
        <p
          className={`mt-1 text-xs ${
            trend === "positive"
              ? "text-success"
              : trend === "pending"
                ? "text-warning"
                : "text-text-muted"
          }`}
        >
          {hint}
        </p>
      )}
    </div>
  );
}
