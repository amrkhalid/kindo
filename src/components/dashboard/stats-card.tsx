import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  className?: string;
  color?: string;
}

export function StatsCard({ title, value, icon, className, color = "white" }: StatsCardProps) {
  return (
    <Card className={cn("overflow-hidden transition-all duration-200", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className={cn("text-sm font-medium", color === "white" ? "text-white/70" : `text-[${color}]/70`)}>{title}</p>
            <p className={cn("text-2xl font-bold mt-2", color === "white" ? "text-white" : `text-[${color}]`)}>{value}</p>
          </div>
          {icon && <div className="transition-transform duration-200 group-hover:scale-110">{icon}</div>}
        </div>
      </CardContent>
    </Card>
  );
}
