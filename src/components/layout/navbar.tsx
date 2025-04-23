import React, { useState, useEffect, ReactNode } from 'react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { 
  Bell, 
  Clock, 
  Settings, 
  UserRound, 
  Globe
} from "lucide-react";
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface NavbarProps {
  children?: ReactNode;
}

export function Navbar({ children }: NavbarProps) {
  const { t, i18n } = useTranslation();
  const [dayOfWeek, setDayOfWeek] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [notificationCount, setNotificationCount] = useState<number>(3);

  // List of available languages
  const languages = [
    { code: 'en', label: 'English', dir: 'ltr' },
    { code: 'ar', label: 'العربية', dir: 'rtl' },
    { code: 'he', label: 'עברית', dir: 'rtl' }
  ];

  // Change language handler
  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem('preferredLanguage', langCode);
  };

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setDayOfWeek(now.toLocaleDateString(i18n.language, { weekday: 'long' }).toUpperCase());
      setTime(now.toLocaleTimeString(i18n.language, {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }));
      setDate(now.toLocaleDateString(i18n.language, {
        month: 'long',
        day: 'numeric'
      }));
    };

    updateDateTime();
    const timer = setInterval(updateDateTime, 1000);

    return () => clearInterval(timer);
  }, [i18n.language]);

  const isRTL = languages.find(lang => lang.code === i18n.language)?.dir === 'rtl';

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <div className="flex flex-col items-center min-w-[160px] gap-0.5">
          <span className="text-2xl font-bold text-[#1A5F5E] tracking-tight leading-none">{time}</span>
          <div className="flex items-center gap-1.5 text-[10px] tracking-wider font-medium text-muted-foreground/70">
            <span>{dayOfWeek}</span>
            <span>•</span>
            <span>{date}</span>
          </div>
        </div>

        <div className="flex-1 flex items-center px-4">
          {children}
        </div>
        
        <div className="flex items-center gap-2">
          {/* Language Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Globe className="h-4 w-4" />
                <span className="sr-only">Change Language</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={isRTL ? 'start' : 'end'} className={isRTL ? 'rtl' : 'ltr'}>
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
          
          {/* Notifications Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 relative">
                <Bell className="h-4 w-4" />
                {notificationCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-4 min-w-4 flex items-center justify-center text-[10px] px-1">
                    {notificationCount}
                  </Badge>
                )}
                <span className="sr-only">{t('navbar.notifications')}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="flex justify-between items-center p-2">
                <span className="font-medium">{t('notifications.title')}</span>
                <Button variant="ghost" className="text-xs h-auto p-1" onClick={() => setNotificationCount(0)}>
                  {t('notifications.markAllRead')}
                </Button>
              </div>
              <DropdownMenuSeparator />
              {notificationCount > 0 ? (
                <div className="max-h-[300px] overflow-y-auto">
                  <div className="text-xs font-medium text-muted-foreground px-2 py-1">{t('notifications.new')}</div>
                  {[...Array(notificationCount)].map((_, idx) => (
                    <DropdownMenuItem key={idx} className="cursor-pointer">
                      <div className="flex flex-col gap-1">
                        <span className="font-medium">Notification Title {idx + 1}</span>
                        <span className="text-xs text-muted-foreground">This is a sample notification message.</span>
                        <span className="text-xs text-muted-foreground">2 hours ago</span>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-muted-foreground">
                  {t('notifications.noNotifications')}
                </div>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="justify-center">
                <Link to="/notifications" className="w-full text-center cursor-pointer">
                  View all
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none">
              <Avatar className="h-8 w-8 hover:opacity-80">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  U
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={isRTL ? 'start' : 'end'} className={isRTL ? 'rtl' : 'ltr'}>
              <DropdownMenuItem asChild className="flex items-center gap-2 cursor-pointer">
                <Link to="/profile">
                  <UserRound className="h-4 w-4" />
                  <span>{t('navbar.profile')}</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="flex items-center gap-2 cursor-pointer">
                <Link to="/settings">
                  <Settings className="h-4 w-4" />
                  <span>{t('navbar.settings')}</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
