import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  Users, 
  School, 
  FileText, 
  ClipboardList, 
  UserCog,
  Package,
  Settings,
  Calendar
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { APP } from "@/constants/app";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  translationKey: string;
}

export function SidebarNav({ className, ...props }: SidebarNavProps) {
  const location = useLocation();
  const pathname = location.pathname;
  const { t } = useTranslation();

  const navItems: NavItem[] = [
    {
      title: t("navigation.dashboard"),
      href: "/",
      icon: Home,
      translationKey: "dashboard"
    },
    {
      title: t("navigation.kindergartens"),
      href: "/kindergartens",
      icon: School,
      translationKey: "kindergartens"
    },
    {
      title: t("navigation.roles"),
      href: "/roles",
      icon: UserCog,
      translationKey: "roles"
    },
    {
      title: t("navigation.children"),
      href: "/children",
      icon: Users,
      translationKey: "children"
    },
    {
      title: t("navigation.groups"),
      href: "/groups",
      icon: Users,
      translationKey: "groups"
    },
    {
      title: t("navigation.financial"),
      href: "/financial",
      icon: FileText,
      translationKey: "financial"
    },
    {
      title: t("navigation.auditLogs"),
      href: "/audit-logs",
      icon: ClipboardList,
      translationKey: "auditLogs"
    },
    {
      title: t("navigation.plans"),
      href: "/plans",
      icon: Package,
      translationKey: "plans"
    },
    {
      title: t("navigation.features"),
      href: "/features",
      icon: Settings,
      translationKey: "features"
    },
    {
      title: 'Activities',
      href: APP.ROUTES.ACTIVITIES,
      icon: Calendar,
      translationKey: 'activities'
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
              "flex items-center gap-3 rounded-lg px-3 py-2 text-base transition-all",
              isActive
                ? "bg-[#1A5F5E]/10 text-[#1A5F5E] font-medium hover:bg-[#1A5F5E]/15"
                : "text-gray-500 hover:bg-gray-100"
            )}
          >
            <item.icon className={cn("h-5 w-5", isActive ? "text-[#1A5F5E]" : "text-gray-400")} />
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}
