import React from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

export default function NotificationsPage() {
  const { t, i18n } = useTranslation();
  
  // List of available languages with their directions
  const languages = [
    { code: 'en', label: 'English', dir: 'ltr' },
    { code: 'ar', label: 'العربية', dir: 'rtl' },
    { code: 'he', label: 'עברית', dir: 'rtl' }
  ];

  const isRTL = languages.find(lang => lang.code === i18n.language)?.dir === 'rtl';
  
  // Sample notifications data
  const notifications = [
    {
      id: 1,
      title: "New child registration",
      message: "A new child has been registered in Green Group",
      time: "2 hours ago",
      isRead: false,
    },
    {
      id: 2,
      title: "Payment received",
      message: "Payment for April tuition has been received from Smith family",
      time: "Yesterday",
      isRead: false,
    },
    {
      id: 3,
      title: "Staff meeting reminder",
      message: "Don't forget about the staff meeting tomorrow at 3pm",
      time: "2 days ago",
      isRead: true,
    },
  ];

  return (
    <div className={cn("space-y-4", isRTL ? "rtl" : "ltr")}>
      <div className={cn(
        "border-b pb-4",
        isRTL ? "text-right" : "text-left"
      )}>
        <h1 className="text-3xl font-bold text-[#1A5F5E]">{t('notifications.title')}</h1>
        <p className="text-sm text-muted-foreground">{t('notifications.description')}</p>
      </div>

      <div className="grid gap-4">
        {notifications.map((notification) => (
          <Card key={notification.id} className={cn(
            "transition-colors hover:bg-gray-50",
            !notification.isRead && "border-l-4 border-l-[#1A5F5E]"
          )}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{notification.title}</CardTitle>
                <span className="text-sm text-muted-foreground">{notification.time}</span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">{notification.message}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-center mt-4">
        <Button variant="outline" className="w-full max-w-sm">
          {t('notifications.loadMore')}
        </Button>
      </div>
    </div>
  );
}
