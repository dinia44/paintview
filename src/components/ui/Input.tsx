import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "flex h-12 w-full rounded-xl border border-border-light bg-white px-4 text-base text-text-dark placeholder:text-muted-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple/40",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";
