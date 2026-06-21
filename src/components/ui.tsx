import { cn } from "@/lib/cn";
import { useAppStore } from "@/store/appStore";
import type { ButtonHTMLAttributes, ReactNode } from "react";

export function PrimaryButton({
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "min-h-[52px] w-full rounded-[16px] bg-pv-purple px-5 text-base font-semibold text-white shadow-[0_12px_28px_rgba(124,77,255,0.28)] transition active:scale-[0.98] disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "min-h-[52px] w-full rounded-[16px] border border-pv-border bg-pv-surface px-5 text-base font-semibold text-pv-charcoal transition active:scale-[0.98]",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function ScreenHeader({
  title,
  onBack,
  right,
}: {
  title: string;
  onBack?: () => void;
  right?: ReactNode;
}) {
  return (
    <header className="flex items-center justify-between gap-3 px-4 pb-3 pt-[max(12px,env(safe-area-inset-top))]">
      <div className="flex min-w-0 items-center gap-2">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            aria-label="Go back"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pv-surface text-lg shadow-sm"
          >
            ←
          </button>
        )}
        <h1 className="truncate text-lg font-bold tracking-tight">{title}</h1>
      </div>
      {right}
    </header>
  );
}

export function BottomSheet({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-t-[28px] border border-pv-border bg-pv-surface px-5 pb-[max(16px,env(safe-area-inset-bottom))] pt-5 shadow-[0_-12px_40px_rgba(31,35,40,0.12)]",
        className
      )}
    >
      {children}
    </div>
  );
}

export function MetricCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-[20px] border border-pv-border bg-pv-surface p-4 shadow-[0_8px_24px_rgba(31,35,40,0.06)]">
      <p className="text-sm text-pv-muted">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
      {hint && <p className="mt-1 text-xs text-pv-muted">{hint}</p>}
    </div>
  );
}

export function ToastStack() {
  const toasts = useAppStore((s) => s.toasts);
  return (
    <div className="pointer-events-none fixed bottom-24 left-0 right-0 z-50 flex flex-col items-center gap-2 px-4">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="rounded-full bg-pv-charcoal px-4 py-2.5 text-sm font-medium text-white shadow-lg"
          role="status"
        >
          {t.text}
        </div>
      ))}
    </div>
  );
}
