import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "flex h-12 w-full rounded-button border border-border bg-surface px-4 text-base text-text-main placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-primary/35",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";
