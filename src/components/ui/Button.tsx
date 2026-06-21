"use client";

import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { ButtonHTMLAttributes, forwardRef } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "soft" | "confirm" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-button font-semibold transition-all focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-primary/35 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          variant === "primary" &&
            "bg-primary text-white shadow-[0_8px_18px_rgba(124,58,237,0.22)] hover:bg-primary-dark",
          variant === "secondary" &&
            "border border-border bg-surface text-primary hover:bg-surface-soft",
          variant === "soft" &&
            "bg-primary-soft text-primary-dark hover:bg-primary-soft/80",
          variant === "confirm" &&
            "bg-accent text-white hover:opacity-90",
          variant === "outline" &&
            "border border-border bg-surface text-primary hover:bg-primary-soft/50",
          variant === "ghost" &&
            "text-text-main hover:bg-surface-soft",
          size === "sm" && "h-9 px-4 text-sm",
          size === "md" && "h-11 px-5 text-sm",
          size === "lg" && "h-14 w-full px-6 text-base",
          className
        )}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
