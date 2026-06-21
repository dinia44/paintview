"use client";

import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { ButtonHTMLAttributes, forwardRef } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "outline";
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
          "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          variant === "primary" &&
            "bg-purple text-white shadow-md shadow-purple/25 hover:bg-purple/90",
          variant === "secondary" &&
            "bg-panel-soft text-text-dark border border-border-light hover:bg-white",
          variant === "outline" &&
            "border-2 border-purple text-purple bg-transparent hover:bg-purple/5",
          variant === "ghost" &&
            "text-text-dark hover:bg-panel-soft",
          size === "sm" && "h-9 px-4 text-sm",
          size === "md" && "h-11 px-5 text-sm",
          size === "lg" && "h-14 px-6 text-base w-full",
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
