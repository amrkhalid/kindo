
import React from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

export default function NotificationsPage() {
  const { t } = useTranslation();
  
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
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{t('notifications.title')}</h1>
          <Button variant="outline" size="sm">
            {t('notifications.markAllRead')}
          </Button>
        </div>

        <div className="space-y-2">
          <h2 className="text-sm font-medium text-muted-foreground">{t('notifications.new')}</h2>
          {notifications.filter(n => !n.isRead).map(notification => (
            <Card key={notification.id} className="mb-3">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-base">{notification.title}</CardTitle>
                <CardDescription className="text-xs">{notification.time}</CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-sm">{notification.message}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-2">
          <h2 className="text-sm font-medium text-muted-foreground">{t('notifications.earlier')}</h2>
          {notifications.filter(n => n.isRead).map(notification => (
            <Card key={notification.id} className="mb-3 bg-muted/30">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-base">{notification.title}</CardTitle>
                <CardDescription className="text-xs">{notification.time}</CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-sm">{notification.message}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
