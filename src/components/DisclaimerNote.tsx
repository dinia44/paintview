import { Info } from "lucide-react";
import { ReactNode } from "react";

type DisclaimerNoteProps = {
  children: ReactNode;
  variant?: "info" | "warning";
};

export function DisclaimerNote({
  children,
  variant = "info",
}: DisclaimerNoteProps) {
  return (
    <div
      className={`flex gap-3 rounded-card border p-4 text-sm leading-relaxed ${
        variant === "warning"
          ? "border-warning/30 bg-warning/10 text-text-main"
          : "border-accent/40 bg-accent-soft/60 text-text-main"
      }`}
      role="note"
    >
      <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
      <p>{children}</p>
    </div>
  );
}
