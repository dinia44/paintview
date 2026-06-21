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
      className={`flex gap-3 rounded-xl border p-4 text-sm ${
        variant === "warning"
          ? "border-warning/30 bg-warning/10 text-amber-900"
          : "border-purple/20 bg-purple/5 text-slate-700"
      }`}
      role="note"
    >
      <Info className="mt-0.5 h-4 w-4 shrink-0 text-purple" aria-hidden />
      <p>{children}</p>
    </div>
  );
}
