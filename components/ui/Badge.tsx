import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export interface BadgeProps {
  children: ReactNode;
  variant?: "success" | "warning" | "neutral" | "info" | "danger";
  size?: "sm" | "md";
  className?: string;
}

export function Badge({
  children,
  variant = "neutral",
  size = "sm",
  className,
}: BadgeProps) {
  const variants = {
    success: "bg-green-100 text-green-800",
    warning: "bg-orange-100 text-orange-800",
    neutral: "bg-gray-100 text-gray-800",
    info: "bg-blue-100 text-blue-800",
    danger: "bg-red-100 text-red-800",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-full",
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
}
