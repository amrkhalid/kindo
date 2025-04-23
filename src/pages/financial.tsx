import React from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  status: 'completed' | 'pending' | 'failed';
}

export default function FinancialPage() {
  const { t, i18n } = useTranslation();
  
  // List of available languages with their directions
  const languages = [
    { code: 'en', label: 'English', dir: 'ltr' },
    { code: 'ar', label: 'العربية', dir: 'rtl' },
    { code: 'he', label: 'עברית', dir: 'rtl' }
  ];

  const isRTL = languages.find(lang => lang.code === i18n.language)?.dir === 'rtl';

  // Sample data
  const transactions: Transaction[] = [
    {
      id: "1",
      date: new Date().toISOString(),
      description: "Monthly tuition fee",
      amount: 500,
      type: "income",
      status: "completed"
    },
    {
      id: "2",
      date: new Date().toISOString(),
      description: "Staff salary payment",
      amount: -2000,
      type: "expense",
      status: "completed"
    },
    {
      id: "3",
      date: new Date().toISOString(),
      description: "Equipment purchase",
      amount: -300,
      type: "expense",
      status: "pending"
    }
  ];

  const columns = [
    {
      key: 'date' as const,
      title: t('financial.date'),
      render: (value: Transaction['date']) => (
        <div className="text-sm text-gray-600">
          {new Date(value).toLocaleDateString()}
        </div>
      ),
    },
    {
      key: 'description' as const,
      title: t('financial.description'),
      render: (value: Transaction['description']) => (
        <div className="text-sm">{value}</div>
      ),
    },
    {
      key: 'amount' as const,
      title: t('financial.amount'),
      render: (value: Transaction['amount']) => (
        <div className={cn(
          "font-medium",
          value >= 0 ? "text-green-600" : "text-red-600"
        )}>
          {value >= 0 ? '+' : ''}{value.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD'
          })}
        </div>
      ),
    },
    {
      key: 'type' as const,
      title: t('financial.type'),
      render: (value: Transaction['type']) => (
        <Badge className={cn(
          value === 'income' ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        )}>
          {t(`financial.${value}`)}
        </Badge>
      ),
    },
    {
      key: 'status' as const,
      title: t('financial.status'),
      render: (value: Transaction['status']) => (
        <Badge variant="outline">
          {t(`financial.${value}`)}
        </Badge>
      ),
    }
  ];

  return (
    <div className={cn("space-y-4", isRTL ? "rtl" : "ltr")}>
      <div className={cn(
        "flex items-center justify-between border-b pb-4",
        isRTL ? "flex-row-reverse" : "flex-row"
      )}>
        <div>
          <h1 className="text-3xl font-bold text-[#1A5F5E]">{t('financial.title')}</h1>
          <p className="text-sm text-muted-foreground">{t('financial.description')}</p>
        </div>
        <Button className="bg-[#1A5F5E] hover:bg-[#1A5F5E]/90">
          <Plus className="h-4 w-4 mr-2" />
          {t('financial.addTransaction')}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t('financial.totalIncome')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {transactions
                .filter(t => t.type === 'income')
                .reduce((sum, t) => sum + t.amount, 0)
                .toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'USD'
                })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t('financial.totalExpenses')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {transactions
                .filter(t => t.type === 'expense')
                .reduce((sum, t) => sum + t.amount, 0)
                .toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'USD'
                })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t('financial.balance')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={cn(
              "text-2xl font-bold",
              transactions.reduce((sum, t) => sum + t.amount, 0) >= 0
                ? "text-green-600"
                : "text-red-600"
            )}>
              {transactions
                .reduce((sum, t) => sum + t.amount, 0)
                .toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'USD'
                })}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="p-6">
        <DataTable
          columns={columns}
          data={transactions}
          searchable
          pagination
          pageSize={10}
        />
      </Card>
    </div>
  );
}
