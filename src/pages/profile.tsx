
import React from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";

export default function ProfilePage() {
  const { t } = useTranslation();
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">{t('profile.title')}</h1>
        
        <div className="flex flex-col md:flex-row gap-6">
          <Card className="w-full md:w-1/3">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Avatar className="w-24 h-24">
                  <AvatarImage src="" />
                  <AvatarFallback className="text-2xl bg-primary text-primary-foreground">US</AvatarFallback>
                </Avatar>
              </div>
              <CardTitle>User Name</CardTitle>
              <p className="text-sm text-muted-foreground">Administrator</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Email:</span>
                <span>user@example.com</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Phone:</span>
                <span>+1 234 567 8900</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Joined:</span>
                <span>January 15, 2023</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="w-full md:w-2/3">
            <CardHeader>
              <CardTitle>{t('profile.personalInfo')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t('profile.name')}</Label>
                <Input id="name" defaultValue="User Name" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">{t('profile.email')}</Label>
                <Input id="email" type="email" defaultValue="user@example.com" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">{t('profile.phone')}</Label>
                <Input id="phone" defaultValue="+1 234 567 8900" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="position">{t('profile.position')}</Label>
                <Input id="position" defaultValue="Administrator" />
              </div>
              
              <div className="pt-4">
                <Button>{t('profile.updateProfile')}</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
