
import React, { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { DataTable } from "@/components/ui/data-table";
import { payments as initialPayments, children } from "@/lib/data";
import { AddPaymentDialog } from "@/components/dialogs/add-payment-dialog";
import { Payment } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

const FinancialPage = () => {
  const { toast } = useToast();
  const [payments, setPayments] = useState<Payment[]>(initialPayments);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const getBadgeColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'overdue':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const columns = [
    {
      key: "childName",
      title: "Child Name",
    },
    {
      key: "parentEmail",
      title: "Parent Email",
    },
    {
      key: "amount",
      title: "Amount",
      render: (value: number) => `$${value.toLocaleString()}`,
    },
    {
      key: "paymentMethod",
      title: "Payment Method",
    },
    {
      key: "paymentDate",
      title: "Payment Date",
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      key: "status",
      title: "Status",
      render: (value: string) => (
        <Badge className={getBadgeColor(value)}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      title: "Created At",
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
  ];

  const handleAddPayment = (newPayment: Payment) => {
    setPayments([...payments, newPayment]);
    toast({
      title: "Payment added",
      description: `Payment of $${newPayment.amount} added for ${newPayment.childName}`,
    });
  };

  return (
    <MainLayout>
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Financial</h1>
        <p className="text-muted-foreground">Manage payments and financial records</p>

        <DataTable
          columns={columns}
          data={payments}
          title="All Payments"
          onAdd={() => setIsAddDialogOpen(true)}
        />

        <AddPaymentDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onAddPayment={handleAddPayment}
          children={children}
        />
      </div>
    </MainLayout>
  );
};

export default FinancialPage;
