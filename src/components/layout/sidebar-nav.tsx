
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  Users, 
  School, 
  FileText, 
  ClipboardList, 
  UserCog
} from "lucide-react";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

export function SidebarNav({ className, ...props }: SidebarNavProps) {
  const location = useLocation();
  const pathname = location.pathname;

  const navItems: NavItem[] = [
    {
      title: "Dashboard",
      href: "/",
      icon: Home,
    },
    {
      title: "Kindergartens",
      href: "/kindergartens",
      icon: School,
    },
    {
      title: "Roles",
      href: "/roles",
      icon: UserCog,
    },
    {
      title: "Children",
      href: "/children",
      icon: Users,
    },
    {
      title: "Groups",
      href: "/groups",
      icon: Users,
    },
    {
      title: "Financial",
      href: "/financial",
      icon: FileText,
    },
    {
      title: "Audit Logs",
      href: "/audit-logs",
      icon: ClipboardList,
    },
  ];

  return (
    <nav className={cn("flex flex-col space-y-1", className)} {...props}>
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
              isActive
                ? "bg-kindergarten-purple/20 text-kindergarten-purple"
                : "text-muted-foreground"
            )}
          >
            <item.icon className={cn("h-4 w-4", isActive ? "text-kindergarten-purple" : "")} />
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}
