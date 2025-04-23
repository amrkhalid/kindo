import React from 'react';
import { useTranslation } from 'react-i18next';
import { DataTable } from '@/components/ui/data-table';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface User {
  username: string;
  email: string;
  identity: string;
  role: string;
  joinDate: string;
}

const RolesPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  
  // List of available languages with their directions
  const languages = [
    { code: 'en', label: 'English', dir: 'ltr' },
    { code: 'ar', label: 'العربية', dir: 'rtl' },
    { code: 'he', label: 'עברית', dir: 'rtl' }
  ];

  const isRTL = languages.find(lang => lang.code === i18n.language)?.dir === 'rtl';

  const columns = [
    {
      key: 'username' as keyof User,
      title: t('table.headers.roles.username'),
      render: (value: string) => (
        <div className={cn(
          "font-medium text-[#1A5F5E]",
          isRTL ? "text-right" : "text-left"
        )}>
          {value}
        </div>
      ),
    },
    {
      key: 'email' as keyof User,
      title: t('table.headers.roles.email'),
      render: (value: string) => (
        <div className={cn(
          "text-gray-600",
          isRTL ? "text-right" : "text-left"
        )}>
          {value}
        </div>
      ),
    },
    {
      key: 'identity' as keyof User,
      title: t('table.headers.roles.identity'),
      render: (value: string) => (
        <div className={cn(
          "text-gray-600",
          isRTL ? "text-right" : "text-left"
        )}>
          {value}
        </div>
      ),
    },
    {
      key: 'role' as keyof User,
      title: t('table.headers.roles.role'),
      render: (value: string) => (
        <Badge className={cn(
          value === "manager" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800",
          isRTL ? "ml-2" : "mr-2"
        )}>
          {value}
        </Badge>
      ),
    },
    {
      key: 'joinDate' as keyof User,
      title: t('table.headers.roles.joinDate'),
      render: (value: string) => (
        <div className={cn(
          "text-gray-600",
          isRTL ? "text-right" : "text-left"
        )}>
          {new Date(value).toLocaleDateString()}
        </div>
      ),
    },
  ];

  // Mock data - replace with actual API call
  const mockData: User[] = [
    {
      username: 'johndoe',
      email: 'john@example.com',
      identity: '123456789',
      role: 'manager',
      joinDate: '2024-03-14',
    },
    // Add more mock data as needed
  ];

  return (
    <div className={cn(
      "space-y-4",
      isRTL ? "rtl" : "ltr"
    )}>
      <div className={cn(
        "border-b pb-4",
        isRTL ? "text-right" : "text-left"
      )}>
        <h1 className="text-3xl font-bold text-[#1A5F5E]">{t('navigation.roles')}</h1>
        <p className="text-sm text-muted-foreground">{t('roles.description')}</p>
      </div>

      <Card className="p-6">
        <DataTable
          data={mockData}
          columns={columns}
          searchable
          pagination
          pageSize={10}
        />
      </Card>
    </div>
  );
};

export default RolesPage;
