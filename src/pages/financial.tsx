import React from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { AddPaymentDialog } from "@/components/dialogs/add-payment-dialog";
import { sampleChildren } from "@/lib/sample-data/children";
import { useToast } from "@/hooks/use-toast";

interface Transaction {
  id: string;
  amount_paid: number;
  payment_date: string;
  payment_method: string;
  parent_email: string;
  child_id: string;
  notes: string;
}

export default function FinancialPage() {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  
  // List of available languages with their directions
  const languages = [
    { code: 'en', label: 'English', dir: 'ltr' },
    { code: 'ar', label: 'العربية', dir: 'rtl' },
    { code: 'he', label: 'עברית', dir: 'rtl' }
  ];

  const isRTL = languages.find(lang => lang.code === i18n.language)?.dir === 'rtl';

  // Sample data
  const [transactions, setTransactions] = React.useState<Transaction[]>([
    {
      id: '1',
      amount_paid: 500,
      payment_date: '2024-12-19T00:00:00Z',
      payment_method: 'credit_card',
      parent_email: 'parent@kendo.ps',
      child_id: '67501da7f41fd3f30dbcd521',
      notes: 'Payment for December tuition',
    },
    {
      id: '2',
      amount_paid: 450,
      payment_date: '2024-11-15T00:00:00Z',
      payment_method: 'cash',
      parent_email: 'parent@kendo.ps',
      child_id: sampleChildren[1]?.id || '2',
      notes: 'November payment',
    },
    {
      id: '3',
      amount_paid: 600,
      payment_date: '2024-10-10T00:00:00Z',
      payment_method: 'bank_transfer',
      parent_email: 'parent@kendo.ps',
      child_id: sampleChildren[2]?.id || '3',
      notes: 'October tuition',
    },
    {
      id: '4',
      amount_paid: 500,
      payment_date: '2024-09-05T00:00:00Z',
      payment_method: 'check',
      parent_email: 'parent@kendo.ps',
      child_id: sampleChildren[3]?.id || '4',
      notes: 'September payment',
    },
    {
      id: '5',
      amount_paid: 520,
      payment_date: '2024-08-20T00:00:00Z',
      payment_method: 'credit_card',
      parent_email: 'parent@kendo.ps',
      child_id: sampleChildren[4]?.id || '5',
      notes: 'August tuition',
    },
    {
      id: '6',
      amount_paid: 480,
      payment_date: '2024-07-18T00:00:00Z',
      payment_method: 'cash',
      parent_email: 'parent@kendo.ps',
      child_id: sampleChildren[5]?.id || '6',
      notes: 'July payment',
    },
    {
      id: '7',
      amount_paid: 510,
      payment_date: '2024-06-12T00:00:00Z',
      payment_method: 'bank_transfer',
      parent_email: 'parent@kendo.ps',
      child_id: sampleChildren[6]?.id || '7',
      notes: 'June tuition',
    },
    {
      id: '8',
      amount_paid: 530,
      payment_date: '2024-05-10T00:00:00Z',
      payment_method: 'check',
      parent_email: 'parent@kendo.ps',
      child_id: sampleChildren[7]?.id || '8',
      notes: 'May payment',
    },
    {
      id: '9',
      amount_paid: 495,
      payment_date: '2024-04-15T00:00:00Z',
      payment_method: 'credit_card',
      parent_email: 'parent@kendo.ps',
      child_id: sampleChildren[8]?.id || '9',
      notes: 'April tuition',
    },
    {
      id: '10',
      amount_paid: 505,
      payment_date: '2024-03-20T00:00:00Z',
      payment_method: 'cash',
      parent_email: 'parent@kendo.ps',
      child_id: sampleChildren[9]?.id || '10',
      notes: 'March payment',
    },
    {
      id: '11',
      amount_paid: 515,
      payment_date: '2024-02-18T00:00:00Z',
      payment_method: 'bank_transfer',
      parent_email: 'parent@kendo.ps',
      child_id: sampleChildren[10]?.id || '11',
      notes: 'February tuition',
    },
    {
      id: '12',
      amount_paid: 525,
      payment_date: '2024-01-15T00:00:00Z',
      payment_method: 'check',
      parent_email: 'parent@kendo.ps',
      child_id: sampleChildren[11]?.id || '12',
      notes: 'January payment',
    },
    {
      id: '13',
      amount_paid: 540,
      payment_date: '2023-12-19T00:00:00Z',
      payment_method: 'credit_card',
      parent_email: 'parent@kendo.ps',
      child_id: sampleChildren[12]?.id || '13',
      notes: 'Payment for December tuition',
    },
    {
      id: '14',
      amount_paid: 490,
      payment_date: '2023-11-15T00:00:00Z',
      payment_method: 'cash',
      parent_email: 'parent@kendo.ps',
      child_id: sampleChildren[13]?.id || '14',
      notes: 'November payment',
    },
    {
      id: '15',
      amount_paid: 560,
      payment_date: '2023-10-10T00:00:00Z',
      payment_method: 'bank_transfer',
      parent_email: 'parent@kendo.ps',
      child_id: sampleChildren[14]?.id || '15',
      notes: 'October tuition',
    },
    {
      id: '16',
      amount_paid: 470,
      payment_date: '2023-09-05T00:00:00Z',
      payment_method: 'check',
      parent_email: 'parent@kendo.ps',
      child_id: sampleChildren[15]?.id || '16',
      notes: 'September payment',
    },
    {
      id: '17',
      amount_paid: 550,
      payment_date: '2023-08-20T00:00:00Z',
      payment_method: 'credit_card',
      parent_email: 'parent@kendo.ps',
      child_id: sampleChildren[16]?.id || '17',
      notes: 'August tuition',
    },
    {
      id: '18',
      amount_paid: 485,
      payment_date: '2023-07-18T00:00:00Z',
      payment_method: 'cash',
      parent_email: 'parent@kendo.ps',
      child_id: sampleChildren[17]?.id || '18',
      notes: 'July payment',
    },
    {
      id: '19',
      amount_paid: 575,
      payment_date: '2023-06-12T00:00:00Z',
      payment_method: 'bank_transfer',
      parent_email: 'parent@kendo.ps',
      child_id: sampleChildren[18]?.id || '19',
      notes: 'June tuition',
    },
    {
      id: '20',
      amount_paid: 495,
      payment_date: '2023-05-10T00:00:00Z',
      payment_method: 'check',
      parent_email: 'parent@kendo.ps',
      child_id: sampleChildren[19]?.id || '20',
      notes: 'May payment',
    },
  ]);

  const columns = [
    {
      key: 'child_id' as const,
      title: t('financial.childName'),
      render: (child_id: string) => {
        const child = sampleChildren.find(c => c.id === child_id);
        if (child) {
          return `${child.firstName} ${child.lastName}`;
        }
        // Special case: if the ID is '67501da7f41fd3f30dbcd521', show a fallback name
        if (child_id === '67501da7f41fd3f30dbcd521') {
          return 'أحمد النتشة'; // Example Arabic name
        }
        return child_id;
      },
    },
    {
      key: 'parent_email' as const,
      title: t('financial.parentEmail'),
      render: (parent_email: string) => parent_email,
    },
    {
      key: 'amount_paid' as const,
      title: t('financial.amount'),
      render: (amount_paid: number) => (
        <div className={cn(
          'font-medium',
          amount_paid >= 0 ? 'text-green-600' : 'text-red-600'
        )}>
          {amount_paid.toLocaleString('en-US', {
            style: 'currency',
            currency: 'ILS',
          })}
        </div>
      ),
    },
    {
      key: 'payment_method' as const,
      title: t('financial.paymentMethod'),
      render: (payment_method: string) => {
        let colorClass = '';
        switch (payment_method) {
          case 'credit_card':
            colorClass = 'bg-blue-100 text-blue-800';
            break;
          case 'cash':
            colorClass = 'bg-green-100 text-green-800';
            break;
          case 'bank_transfer':
            colorClass = 'bg-purple-100 text-purple-800';
            break;
          case 'check':
            colorClass = 'bg-yellow-100 text-yellow-800';
            break;
          default:
            colorClass = 'bg-gray-100 text-gray-800';
        }
        return <Badge className={colorClass}>{
          payment_method === 'credit_card' ? 'CREDIT CARD'
          : payment_method === 'cash' ? 'CASH'
          : payment_method === 'bank_transfer' ? 'BANK TRANSFER'
          : payment_method === 'check' ? 'CHECK'
          : payment_method.toUpperCase()
        }</Badge>;
      },
    },
    {
      key: 'payment_date' as const,
      title: t('financial.paymentDate'),
      render: (payment_date: string) => new Date(payment_date).toLocaleDateString(),
    },
    {
      key: 'notes' as const,
      title: t('financial.notes'),
      render: (notes: string) => notes,
    },
  ];

  // AddPaymentDialog handler
  const handleAddPayment = (payment) => {
    setTransactions(prev => [
      { ...payment, id: crypto.randomUUID(), parent_email: 'parent@kendo.ps' },
      ...prev,
    ]);
    toast({
      title: t('financial.addSuccess'),
      description: t('financial.addTransaction'),
    });
  };

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
        <Button className="bg-[#1A5F5E] hover:bg-[#1A5F5E]/90" onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          {t('financial.addTransaction')}
        </Button>
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
      <AddPaymentDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAddPayment={handleAddPayment}
        children={sampleChildren}
      />
    </div>
  );
}
