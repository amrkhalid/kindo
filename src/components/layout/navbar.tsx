import React, { useState, useEffect, ReactNode } from 'react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent
} from "@/components/ui/dropdown-menu";
import {
  Bell,
  Clock,
  Settings,
  UserRound,
  Globe,
  Menu,
  School,
  LogOut,
  ChevronRight
} from "lucide-react";
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { SidebarNav } from "./sidebar-nav";
import kendoLogo from "@/assets/kindo-logo.png";
import { cn } from "@/lib/utils";

interface NavbarProps {
  children?: ReactNode;
}

// Mock data for kindergartens - replace with actual data from your API
const kindergartens = [
  { id: 1, name: "Kindergarten 1 " },
  { id: 2, name: "Kindergarten 2" },
  { id: 3, name: "Kindergarten 3" },
  { id: 4, name: "Kindergarten 4" },
  { id: 5, name: "Kindergarten 5" }
];

export function Navbar({ children }: NavbarProps) {
  const { t, i18n } = useTranslation();
  const isMobile = useIsMobile();
  const isRTL = i18n.dir() === 'rtl';
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState('');

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const timeOptions: Intl.DateTimeFormatOptions = { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      };
      const dateOptions: Intl.DateTimeFormatOptions = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      };
      const dayOptions: Intl.DateTimeFormatOptions = { 
        weekday: 'long' 
      };

      setTime(now.toLocaleTimeString(i18n.language, timeOptions));
      setDate(now.toLocaleDateString(i18n.language, dateOptions));
      setDayOfWeek(now.toLocaleDateString(i18n.language, dayOptions));
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, [i18n.language]);

  const languages = [
    { code: 'en', label: 'English', dir: 'ltr' },
    { code: 'ar', label: 'العربية', dir: 'rtl' },
    { code: 'he', label: 'עברית', dir: 'rtl' }
  ];

  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode);
  };

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-2 sm:px-4">
        <div className="flex flex-col items-center min-w-[120px] sm:min-w-[160px] gap-0.5">
          <span className="text-xl sm:text-2xl font-bold text-[#1A5F5E] tracking-tight leading-none">{time}</span>
          <div className="flex items-center gap-1.5 text-[10px] sm:text-xs tracking-wider font-medium text-muted-foreground/70">
            <span>{dayOfWeek}</span>
            <span>•</span>
            <span>{date}</span>
          </div>
        </div>

        <div className="flex-1 flex items-center px-2 sm:px-4">
          {children}
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          {/* Mobile menu button */}
          {isMobile && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <Menu className="h-4 w-4" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-4">
                <div className="flex flex-col h-full">
                  <div className="mb-8">
                    <div className="flex items-center mb-2">
                      <img src={kendoLogo} alt="Kendo" className="h-8 w-auto" />
                    </div>
                    <p className="text-sm text-muted-foreground">Kindergarten Management</p>
                  </div>
                  <SidebarNav className="flex-1" />
                  <div className="border-t pt-4 mt-4">
                    <p className="text-xs text-muted-foreground">© 2025 Kendo</p>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          )}

          {/* Language Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Globe className="h-4 w-4" />
                <span className="sr-only">Change Language</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align={isRTL ? 'start' : 'end'} 
              className={cn(
                "w-[200px]",
                isRTL ? "rtl" : "ltr"
              )}
            >
              {languages.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className="cursor-pointer"
                >
                  {lang.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 relative">
                <Bell className="h-4 w-4" />
                <Badge 
                  className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center"
                  variant="destructive"
                >
                  3
                </Badge>
                <span className="sr-only">Notifications</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align={isRTL ? 'start' : 'end'}
              className={cn(
                "w-[300px] sm:w-[350px]",
                isRTL ? "rtl" : "ltr"
              )}
            >
              <div className="p-2">
                <h4 className="text-sm font-medium">Notifications</h4>
              </div>
              <DropdownMenuSeparator />
              {/* Add notification items here */}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <span className="sr-only">User menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align={isRTL ? 'start' : 'end'}
              className={cn(
                "w-[200px]",
                isRTL ? "rtl" : "ltr"
              )}
            >
              <DropdownMenuItem>
                <UserRound className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
