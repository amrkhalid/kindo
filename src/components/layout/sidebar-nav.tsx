import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import {
  Users,
  School,
  UserCog,
  Package,
  Settings,
  Wrench,
  LayoutPanelLeft,
  Calendar,
  Code,
  Baby,
  ContactRound,
  CircleDollarSign,
  FileSearch,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { APP } from "@/constants/app";
import { Separator } from "@/components/ui/separator";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  isCollapsed?: boolean;
}

export function SidebarNav({
  className,
  isCollapsed,
  ...props
}: SidebarNavProps) {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const isRTL = i18n.dir() === "rtl";

  const userRole = localStorage.getItem("user_role");
  const isSuperuser = localStorage.getItem("is_superuser") === "true";

  const baseNavItems = [
    {
      title: t("navbar.children"),
      href: "/children",
      icon: Baby,
    },
    {
      title: t("navbar.roles"),
      href: "/roles",
      icon: ContactRound,
    },
    {
      title: t("navbar.groups"),
      href: "/groups",
      icon: Users,
    },
    {
      title: t("navbar.financial"),
      href: "/financial",
      icon: CircleDollarSign,
    },
    {
      title: t("navbar.schedules"),
      href: "/activities",
      icon: Calendar,
    },
  ];

  const developerNavItems = [
    // {
    //   title: t('navbar.dashboard'),
    //   href: '/',
    //   icon: LayoutDashboard,
    // },
    {
      title: t("navbar.kindergartens"),
      href: "/kindergartens",
      icon: School,
    },
    {
      title: t("navigation.systemUsers"),
      href: "/system-users",
      icon: UserCog,
    },
    {
      title: t("navbar.auditLogs"),
      href: "/audit-logs",
      icon: FileSearch,
    },
    {
      title: t("navigation.plans"),
      href: "/plans",
      icon: Package,
    },
    {
      title: t("navbar.features"),
      href: "/features",
      icon: Code,
    },
  ];

  const filteredNavItems = baseNavItems.filter((item) => {
    if (userRole === "secretary") {
      return item.href !== "/financial";
    }
    return true;
  });

  const filteredAdminItems = isSuperuser ? developerNavItems : [];

  const renderNavItem = (item: (typeof baseNavItems)[0]) => {
    const isActive = location.pathname === item.href;
    const Icon = item.icon;

    return (
      <Link
        key={item.href}
        to={item.href}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
          isActive
            ? "bg-accent text-accent-foreground"
            : "text-muted-foreground",
          isCollapsed && "justify-center px-2",
          isRTL && "text-right"
        )}
      >
        <Icon className={cn("h-4 w-4", isCollapsed && "mx-auto")} />
        {!isCollapsed && (
          <span className={cn("truncate", isRTL && "text-right")}>
            {item.title}
          </span>
        )}
      </Link>
    );
  };

  return (
    <nav className={cn("flex flex-col gap-2", className)} {...props}>
      <div className="flex flex-col gap-2">
        {isCollapsed ? (
          <div className="text-center text-muted-foreground">
            <LayoutPanelLeft className="w-5 h-5 mx-auto" />
            <Separator className="my-2" />
          </div>
        ) : (
          <div
            className={cn(
              "px-3 text-xs font-semibold text-muted-foreground",
              isCollapsed && "text-center",
              isRTL && "text-right"
            )}
          >
            {t("navigation.general")}
            <Separator className="my-2" />
          </div>
        )}
        {filteredNavItems.map(renderNavItem)}
      </div>

      {filteredAdminItems.length > 0 && (
        <div className="pt-5 flex flex-col gap-2">
          {isCollapsed ? (
            <div className="text-center text-muted-foreground">
              <Wrench className="w-5 h-5 mx-auto" />
              <Separator className="my-2" />
            </div>
          ) : (
            <div
              className={cn(
                "px-3 text-xs font-semibold text-muted-foreground",
                isCollapsed && "text-center",
                isRTL && "text-right"
              )}
            >
              {t("navigation.developerOptions")}
              <Separator className="my-2" />
            </div>
          )}
          {filteredAdminItems.map(renderNavItem)}
        </div>
      )}
    </nav>
  );
}
