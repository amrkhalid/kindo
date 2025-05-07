import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description: string;
  children?: ReactNode;
  className?: string;
  isRTL?: boolean;
}

export function PageHeader({ title, description, children, className, isRTL = false }: PageHeaderProps) {
  return (
    <div className={cn(
      "flex items-center justify-between border-b pb-4",
      isRTL ? "flex-row-reverse" : "flex-row",
      className
    )}>
      <div>
        <h1 className="text-2xl font-bold text-[#1A5F5E]">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {children}
    </div>
  );
} 