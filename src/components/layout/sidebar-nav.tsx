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
  Calendar,
  Code,
  LayoutDashboard,
  Wrench,
  Baby
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { APP } from "@/constants/app";
import { Separator } from "@/components/ui/separator";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  isCollapsed?: boolean;
}

export function SidebarNav({ className, isCollapsed, ...props }: SidebarNavProps) {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const isRTL = i18n.dir() === 'rtl';

  const navItems = [
    {
      title: t('nav.dashboard'),
      href: '/',
      icon: LayoutDashboard,
    },
    {
      title: t('nav.kindergartens'),
      href: '/kindergartens',
      icon: School,
    },
    {
      title: t('nav.children'),
      href: '/children',
      icon: Baby,
    },
    {
      title: t('nav.groups'),
      href: '/groups',
      icon: Users,
    },
    {
      title: t('nav.activities'),
      href: '/activities',
      icon: Calendar,
    },
    {
      title: t('nav.financial'),
      href: '/financial',
      icon: FileText,
    },
  ];

  const adminItems = [
    {
      title: t('nav.plans'),
      href: '/plans',
      icon: Package,
    },
    {
      title: t('nav.features'),
      href: '/features',
      icon: Code,
    },
    {
      title: t('nav.roles'),
      href: '/roles',
      icon: UserCog,
    },
    {
      title: t('nav.systemUsers'),
      href: '/system-users',
      icon: Wrench,
    },
  ];

  const renderNavItem = (item: typeof navItems[0]) => {
    const isActive = location.pathname === item.href;
    const Icon = item.icon;

    return (
      <Link
        key={item.href}
        to={item.href}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
          isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground",
          isCollapsed && "justify-center px-2",
          isRTL && "flex-row-reverse"
        )}
      >
        <Icon className={cn(
          "h-4 w-4",
          isCollapsed && "mx-auto"
        )} />
        {!isCollapsed && (
          <span className={cn(
            "truncate",
            isRTL && "text-right"
          )}>
            {item.title}
          </span>
        )}
      </Link>
    );
  };

  return (
    <nav className={cn(
      "flex flex-col gap-2",
      className
    )} {...props}>
      <div className="flex flex-col gap-2">
        {navItems.map(renderNavItem)}
      </div>

      <Separator className="my-2" />

      <div className="flex flex-col gap-2">
        <div className={cn(
          "px-3 text-xs font-semibold text-muted-foreground",
          isCollapsed && "text-center",
          isRTL && "text-right"
        )}>
          {t('nav.admin')}
        </div>
        {adminItems.map(renderNavItem)}
      </div>
    </nav>
  );
}
