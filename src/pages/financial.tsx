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
import {
  deleteInvoice,
  getAllTransaction,
  Invoice,
  updateInvoice,
} from "@/api/Finance/financeApis";
import { Column } from "@/types/data-table";
import {
  Child,
  getAllChildrenNames,
} from "@/api/Kindergarten/Children/childrenApis";
import { DeleteDialog } from "@/components/dialogs/delete-dialog";
import { EditPaymentDialog } from "@/components/dialogs/edit-payment-dialog";

export default function FinancialPage() {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);

  // List of available languages with their directions
  const languages = [
    { code: "en", label: "English", dir: "ltr" },
    { code: "ar", label: "العربية", dir: "rtl" },
    { code: "he", label: "עברית", dir: "rtl" },
  ];

  const isRTL =
    languages.find((lang) => lang.code === i18n.language)?.dir === "rtl";
  const [transactions, setTransactions] = React.useState<Invoice[]>([]);
  const [selectedTrans, setSelectedTrans] = useState<Invoice | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const Kg_id = localStorage.getItem("selectedKG");
  const [children, setChildren] = useState<Child[]>([]);

  useEffect(() => {
    getAllChildrenNames(Kg_id)
      .then((res) => setChildren(res.data.data))
      .catch((err) => console.error("Error fetching Children:", err));

    getAllTransaction(15, page, Kg_id)
      .then((res) => {
        setTransactions((prev) =>
          page === 1 ? res.data.data : [...prev, ...res.data.data]
        );
        setTotalPages(res.data.totalPages);
      })
      .catch((err) => {
        console.error("Error fetching Transactions:", err);
      });
  }, [page, Kg_id]);

  useEffect(() => {
    const handleScroll = () => {
      const nearBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 300;
      if (nearBottom && page < totalPages) {
        setPage((prev) => prev + 1);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [page, totalPages]);

  const handleEditPayment = async ({
    amount_paid,
  }: {
    amount_paid: number;
  }) => {
    if (!selectedTrans) return;
    try {
      await updateInvoice(
        Kg_id,
        {
          amount_paid,
        },
        selectedTrans.id
      );

      const res = await getAllTransaction(15, page, Kg_id);
      setTransactions(res.data.data);
      toast({
        title: t("financial.editSuccess"),
        description: t("financial.editSuccess"),
        variant: "success",
      });
      setIsEditDialogOpen(false);
      setSelectedTrans(null);
    } catch (error) {
      toast({
        title: t("common.error"),
        description: t("financial.editError"),
        variant: "destructive",
      });
      console.error("Error editing payment:", error);
    }
  };

  const handleDelete = async () => {
    if (!selectedTrans) return;

    console.log("selected", selectedTrans.id);

    try {
      await deleteInvoice(Kg_id, selectedTrans.id);
      const res = await getAllTransaction(15, page, Kg_id);
      setTransactions(res.data.data);
      setIsDeleteDialogOpen(false);
      setSelectedTrans(null);
      toast({
        title: t("common.success"),
        description: t("financial.deleteSuccess"),
        variant: "success",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: t("common.error"),
        description: t("financial.deleteError"),
      });
    }
  };

  const columns: Column<Invoice>[] = [
    {
      key: "user_name",
      title: t("table.headers.financial.childName"),
      render: (_: any, row: Invoice) => (
        <div
          className={cn(
            "font-medium text-[#1A5F5E]",
            isRTL ? "text-right" : "text-left"
          )}
        >
          {[
            row.childuser.first_name,
            row.childuser.second_name,
            row.childuser.third_name,
            row.childuser.last_name,
          ]
            .filter(Boolean)
            .join(" ")}
        </div>
      ),
    },
    {
      key: "parent_email" as const,
      title: t("financial.parentEmail"),
      render: (_: any, row: Invoice) => (
        <div
          className={cn("text-gray-600", isRTL ? "text-right" : "text-left")}
        >
          {row.parentuser?.email}
        </div>
      ),
    },
    {
      key: "amount_paid" as const,
      title: t("financial.amount"),
      render: (amount_paid: number) => (
        <div
          className={cn(
            "font-medium",
            amount_paid >= 0 ? "text-green-600" : "text-red-600"
          )}
        >
          {amount_paid.toLocaleString("en-US", {
            style: "currency",
            currency: "ILS",
          })}
        </div>
      ),
    },
    {
      key: "payment_method" as const,
      title: t("financial.paymentMethod"),
      render: (payment_method: string) => {
        let colorClass = "";
        switch (payment_method) {
          case "credit_card":
            colorClass = "bg-blue-100 text-blue-800";
            break;
          case "cash":
            colorClass = "bg-green-100 text-green-800";
            break;
          case "bank_transfer":
            colorClass = "bg-purple-100 text-purple-800";
            break;
          case "check":
            colorClass = "bg-yellow-100 text-yellow-800";
            break;
          default:
            colorClass = "bg-gray-100 text-gray-800";
        }
        return (
          <Badge className={colorClass}>
            {payment_method === "credit_card"
              ? "CREDIT CARD"
              : payment_method === "cash"
              ? "CASH"
              : payment_method === "bank_transfer"
              ? "BANK TRANSFER"
              : payment_method === "check"
              ? "CHECK"
              : payment_method.toUpperCase()}
          </Badge>
        );
      },
    },
    {
      key: "payment_date" as const,
      title: t("financial.paymentDate"),
      render: (payment_date: string) =>
        new Date(payment_date).toLocaleDateString(),
    },
    {
      key: "notes" as const,
      title: t("financial.notes"),
      render: (notes: string) => notes,
    },
    {
      key: "active",
      title: t("table.headers.kindergartens.isActive"),
      render: (value: boolean) => (
        <Badge
          className={
            value ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }
        >
          {value ? t("common.active") : t("common.inactive")}
        </Badge>
      ),
    },
  ];

  const handleAddPayment = async () => {
    const res = await getAllTransaction(15, page, Kg_id);
    setTransactions(res.data.data);
  };

  return (
    <div className={cn("space-y-4", isRTL ? "rtl" : "ltr")}>
      <div
        className={cn(
          "flex items-center justify-between border-b pb-4",
          isRTL ? "flex-row-reverse" : "flex-row"
        )}
      >
        <div>
          <h1 className="text-3xl font-bold text-[#1A5F5E]">
            {t("financial.title")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("financial.description")}
          </p>
        </div>
        <Button
          className="bg-[#1A5F5E] hover:bg-[#1A5F5E]/90"
          onClick={() => setIsAddDialogOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          {t("financial.addTransaction")}
        </Button>
      </div>

      <Card className="p-6">
        <DataTable
          columns={columns}
          data={transactions}
          searchable
          onDelete={(selectedTrans) => {
            setSelectedTrans(selectedTrans);
            setIsDeleteDialogOpen(true);
          }}
          onEdit={(payment) => {
            setSelectedTrans(payment);
            setIsEditDialogOpen(true);
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
        title={t("financial.deleteTitle")}
        description={t("financial.deleteDescription")}
      />

      <EditPaymentDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onEditPayment={handleEditPayment}
        payment={selectedTrans}
      />
    </div>
  );
}
