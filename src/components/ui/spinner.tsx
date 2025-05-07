import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type SpinnerProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
  "aria-label"?: string;
};

export function Spinner({
  size = "md",
  className,
  "aria-label": ariaLabel = "Loading",
}: SpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-8 w-8",
  };

  return (
    <div
      role="status"
      aria-label={ariaLabel}
      className="inline-flex items-center justify-center"
    >
      <Loader2
        className={cn(
          "animate-spin text-emerald-500 dark:text-emerald-400",
          sizeClasses[size],
          className
        )}
      />
      <span className="sr-only">{ariaLabel}</span>
    </div>
  );
}
