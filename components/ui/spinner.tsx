import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import { Loading03Icon } from "@hugeicons/core-free-icons";

function Spinner({
  className,
  strokeWidth = 2,
  ...props
}: React.ComponentProps<"svg">) {
  const numericStrokeWidth = Number(strokeWidth);

  return (
    <HugeiconsIcon
      icon={Loading03Icon}
      strokeWidth={
        Number.isFinite(numericStrokeWidth)
          ? numericStrokeWidth
          : 2
      }
      role="status"
      aria-label="Loading"
      className={cn("size-4 animate-spin", className)}
      {...props}
    />
  );
}

export { Spinner };
