import { cn } from "@/lib/cn";
import type { LucideIcon } from "lucide-react";

export function ActionCard({
  title,
  subtitle,
  tone = "lavender",
  onClick,
  icon: Icon,
}: {
  title: string;
  subtitle: string;
  tone?: "lavender" | "sage" | "beige";
  onClick?: () => void;
  icon: LucideIcon;
}) {
  const tones = {
    lavender: {
      card: "bg-pv-lavender/70 border-indigo-100",
      icon: "bg-pv-purple text-white",
    },
    sage: {
      card: "bg-pv-sage-soft border-emerald-100",
      icon: "bg-pv-sage text-white",
    },
    beige: {
      card: "bg-pv-beige border-amber-100",
      icon: "bg-pv-tan text-white",
    },
  };

  const style = tones[tone];

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-4 rounded-2xl border p-4 text-left shadow-[0_8px_24px_rgba(17,24,39,0.06)] transition active:scale-[0.98]",
        style.card
      )}
    >
      <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-sm", style.icon)}>
        <Icon className="h-6 w-6" strokeWidth={2.2} />
      </div>
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
  thumbnail,
  onClick,
}: {
  name: string;
  status: string;
  amount: string;
  date: string;
  thumbnail?: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-2xl border border-pv-border bg-pv-surface p-3 text-left shadow-sm transition active:bg-pv-surface-soft"
    >
      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-pv-surface-soft">
        {thumbnail ? (
          <img src={thumbnail} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-pv-lavender text-lg">🏠</div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold">{name}</p>
        <p className="text-sm text-pv-muted">
          {status} — {amount}
        </p>
        <p className="text-xs text-pv-muted">{date}</p>
      </div>
    </button>
  );
}
