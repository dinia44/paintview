import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

export function Card({
  className,
  soft,
  ...props
}: HTMLAttributes<HTMLDivElement> & { soft?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-card border border-border p-5",
        soft
          ? "bg-surface-soft shadow-none"
          : "bg-surface shadow-card",
        className
      )}
      {...props}
    />
  );
}

export function CardTitle({
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("text-lg font-semibold text-text-main", className)}
      {...props}
    />
  );
}
