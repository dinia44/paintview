import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

export function ActionCard({
  title,
  subtitle,
  tone = "lavender",
  onClick,
  icon,
}: {
  title: string;
  subtitle: string;
  tone?: "lavender" | "sage" | "beige";
  onClick?: () => void;
  icon?: ReactNode;
}) {
  const tones = {
    lavender: "bg-pv-lavender border-pv-purple/10",
    sage: "bg-pv-sage-soft border-pv-sage/30",
    beige: "bg-pv-beige/60 border-pv-tan/20",
  };
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-start gap-3 rounded-[22px] border p-4 text-left shadow-[0_12px_30px_rgba(31,35,40,0.08)] transition active:scale-[0.98]",
        tones[tone]
      )}
    >
      {icon && (
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/70 text-xl">
          {icon}
        </div>
      )}
      <div>
        <p className="font-bold text-pv-charcoal">{title}</p>
        <p className="mt-0.5 text-sm text-pv-muted">{subtitle}</p>
      </div>
    </button>
  );
}

export function ProjectListItem({
  name,
  status,
  amount,
  date,
  onClick,
}: {
  name: string;
  status: string;
  amount: string;
  date: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between gap-3 rounded-[18px] border border-pv-border bg-pv-surface px-4 py-3.5 text-left shadow-sm transition active:bg-pv-surface-soft"
    >
      <div className="min-w-0">
        <p className="truncate font-semibold">{name}</p>
        <p className="text-sm text-pv-muted">
          {status} · {date}
        </p>
      </div>
      <p className="shrink-0 font-bold text-pv-charcoal">{amount}</p>
    </button>
  );
}
