import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { AddPaymentDialog } from "@/components/dialogs/add-payment-dialog";
import { useToast } from "@/hooks/use-toast";
import { deleteInvoice, getAllTransaction, Invoice } from "@/api/Finance/financeApis";
import { Column } from "@/types/data-table";
import {
  Child,
  getAllChildren,
} from "@/api/Kindergarten/Children/childrenApis";
import { DeleteDialog } from "@/components/dialogs/delete-dialog";

interface Transaction {
  id: string;
  user_name: string;
  amount_paid: number;
  payment_date: string;
  payment_method: string;
  parent_email: string;
  notes: string;
  active:boolean;
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
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [selectedTrans, setSelectedTrans] = useState<Transaction | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const Kg_id = localStorage.getItem("selectedKG");
  const [children, setChildren] = useState<Child[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const childrenData = await getAllChildren(Kg_id);
        setChildren(childrenData);

        const transactionsResponse = await getAllTransaction(Kg_id);
        console.log("Fetched Trans Response:", transactionsResponse);

        const mappedTrans = transactionsResponse.map((r) => ({
          id: r.id,
          user_name: r.childuser?.first_name + " " + r.childuser?.last_name,
          amount_paid: r.amount_paid,
          payment_method: r.payment_method,
          parent_email: r.parentuser?.email,
          payment_date: r.created_at,
          notes: r.notes,
          active:r.active,
        }));
        setTransactions(mappedTrans);
      } catch (error) {
        console.error("Failed to fetch data", error);
        toast({
          variant: "destructive",
          title: t("common.error"),
          description: t("children.loadError"),
        });
      }
    };

    fetchData();
  }, [Kg_id]);

    const handleDelete = async () => {
    if (!selectedTrans) return;

    console.log("selected",selectedTrans.id);

    try {
      await deleteInvoice(Kg_id,selectedTrans.id);
      setTimeout(() => window.location.reload(), 1000);
      setIsDeleteDialogOpen(false);
      setSelectedTrans(null);
      toast({
        title: t('common.success'),
        description: t('financial.deleteSuccess'),
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: t('common.error'),
        description: t('financial.deleteError'),
      });
    }
  };


  const columns: Column<Transaction>[] = [
    {
      key: "user_name",
      title: t("table.headers.roles.username"),
      render: (value: string) => (
        <div
          className={cn(
            "font-medium text-[#1A5F5E]",
            isRTL ? "text-right" : "text-left"
          )}
        >
          {value}
        </div>
      ),
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
    {
      key: 'active',
      title: t('table.headers.kindergartens.isActive'),
      render: (value: boolean) => (
        <Badge className={value ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
          {value ? t('common.active') : t('common.inactive')}
        </Badge>
      ),
    },];

  const handleAddPayment = (payment: Invoice) => {
    const newTransaction: Transaction = {
      id: payment.id,
      user_name:
        payment.childuser?.first_name + " " + payment.childuser?.last_name,
      amount_paid: payment.amount_paid,
      payment_method: payment.payment_method,
      parent_email: payment.parentuser?.email || "",
      payment_date: payment.created_at,
      notes: payment.notes,
      active:payment.active,
    };

    setTransactions((prev) => [newTransaction, ...prev]);
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
          onDelete={(selectedTrans) => {
          setSelectedTrans(selectedTrans);
          setIsDeleteDialogOpen(true);
          }}
        />
      </Card>
      <AddPaymentDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAddPayment={handleAddPayment}
        children={children}
      />

      <DeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
        title={t('financial.deleteTitle')}
        description={t('financial.deleteDescription')}
      />
    </div>
  );
}
