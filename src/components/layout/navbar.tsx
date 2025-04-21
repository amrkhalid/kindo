
import React, { useState, useEffect } from 'react';
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

export function Navbar() {
  const { t, i18n } = useTranslation();
  const [time, setTime] = useState<string>(new Date().toLocaleTimeString());
  const [notificationCount, setNotificationCount] = useState<number>(3); // Example notification count

  // List of available languages
  const languages = [
    { code: 'en', label: 'English' },
    { code: 'ar', label: 'العربية' },
    { code: 'he', label: 'עברית' }
  ];

  // Change language handler
  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode);
    // You could save this preference to localStorage
    localStorage.setItem('preferredLanguage', langCode);
  };

  useEffect(() => {
    // Initialize language from localStorage if available
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage);
    }
    
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(timer);
  }, [i18n]);

  return (
    <nav className="border-b bg-background h-14 px-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground" title={t('navbar.time')}>{time}</span>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Language Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Globe className="h-4 w-4" />
              <span className="sr-only">Change Language</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
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
                <Badge className="absolute -top-1 -right-1 h-4 min-w-4 flex items-center justify-center text-[10px] px-1 bg-primary text-primary-foreground">
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
          <DropdownMenuContent align="end" className="w-52">
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
    </nav>
  );
}
