import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  className?: string;
}

export function StatsCard({ title, value, icon, className }: StatsCardProps) {
  return (
    <Card className={cn(
      "relative overflow-hidden transition-all hover:scale-[1.02] duration-200",
      className
    )}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-x-2">
          <div className="flex-1">
            <p className="text-sm font-medium text-white/80 leading-none mb-3">{title}</p>
            <p className="text-2xl font-bold text-white leading-none">{value}</p>
          </div>
          {icon && (
            <div className="shrink-0 transition-transform duration-200 group-hover:scale-110">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
    </Card>
  );
}
