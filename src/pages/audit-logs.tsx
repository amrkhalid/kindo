import React from "react";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";

export default function AuditLogsPage() {
  const { t, i18n } = useTranslation();

  // List of available languages with their directions
  const languages = [
    { code: 'en', label: 'English', dir: 'ltr' },
    { code: 'ar', label: 'العربية', dir: 'rtl' },
    { code: 'he', label: 'עברית', dir: 'rtl' }
  ];

  const isRTL = languages.find(lang => lang.code === i18n.language)?.dir === 'rtl';

  // Sample data
  const auditLogs = [
    {
      id: "1",
      action: "LOGIN",
      user: "Test Name",
      timestamp: new Date().toISOString(),
      details: "User logged in successfully",
      ip: "192.168.1.1"
    },
    {
      id: "2",
      action: "UPDATE",
      user: "Test Name2",
      timestamp: new Date().toISOString(),
      details: "Updated kindergarten details",
      ip: "192.168.1.2"
    },
    {
      id: "3",
      action: "DELETE",
      user: "Admin",
      timestamp: new Date().toISOString(),
      details: "Deleted user account",
      ip: "192.168.1.3"
    }
  ];

  const columns = [
    {
      key: 'timestamp',
      title: t('auditLogs.timestamp'),
      render: (value: string) => (
        <div className="text-sm text-gray-600">
          {new Date(value).toLocaleString()}
        </div>
      ),
    },
    {
      key: 'action',
      title: t('auditLogs.action'),
      render: (value: string) => (
        <Badge className={cn(
          value === 'LOGIN' && "bg-green-100 text-green-800",
          value === 'UPDATE' && "bg-blue-100 text-blue-800",
          value === 'DELETE' && "bg-red-100 text-red-800"
        )}>
          {value}
        </Badge>
      ),
    },
    {
      key: 'user',
      title: t('auditLogs.user'),
      render: (value: string) => (
        <div className="font-medium text-[#1A5F5E]">{value}</div>
      ),
    },
    {
      key: 'details',
      title: t('auditLogs.details'),
      render: (value: string) => (
        <div className="text-sm">{value}</div>
      ),
    },
  ];

  return (
    <div className={cn("space-y-4", isRTL ? "rtl" : "ltr")}>
      <div className={cn(
        "border-b pb-4",
        isRTL ? "text-right" : "text-left"
      )}>
        <h1 className="text-3xl font-bold text-[#1A5F5E]">{t('auditLogs.title')}</h1>
        <p className="text-sm text-muted-foreground">{t('auditLogs.description')}</p>
      </div>

      <Card className="p-6">
        <DataTable
          columns={columns}
          data={auditLogs}
          searchable
          pagination
          pageSize={10}
        />
      </Card>
    </div>
  );
}

