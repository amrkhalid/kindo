
import { cn } from "@/lib/utils";

interface ShimmerEffectProps {
  className?: string;
}

export const ShimmerEffect = ({ className }: ShimmerEffectProps) => {
  return (
    <div 
      className={cn(
        "animate-pulse rounded-md bg-gradient-to-r from-transparent via-muted/20 to-transparent",
        className
      )}
    />
  );
};
