import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { Child } from "@/api/Kindergarten/Children/childrenApis";
import { createInvoice, InvoiceRequest } from "@/api/Finance/financeApis";

interface AddPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddPayment: (payment: InvoiceRequest) => void;
  children: Child[];
}
const Kg_id = localStorage.getItem("selectedKG");
const paymentMethods = [
  { value: "credit_card", labelKey: "financial.creditCard" },
  { value: "cash", labelKey: "financial.cash" },
  { value: "bank_transfer", labelKey: "financial.bankTransfer" },
  { value: "check", labelKey: "financial.check" }
];

export function AddPaymentDialog({
  open,
  onOpenChange,
  onAddPayment,
  children,
}: AddPaymentDialogProps) {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [form, setForm] = useState<InvoiceRequest>({
    child_id: "",
    parent_id: "",
    amount_paid: 0,
    payment_method: "",
    payment_date: "",
    notes: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.child_id || !form.parent_id || !form.amount_paid || !form.payment_method || !form.payment_date) {
      toast({
        title: t('common.error'),
        description: t('common.required'),
        variant: "destructive",
      });
      return;
    }

    const newPayment = {
      child_id: form.child_id,
      parent_id: form.parent_id,
      amount_paid: form.amount_paid,
      payment_method: form.payment_method,
      payment_date: form.payment_date,
      notes: form.notes,
    };
    console.log(newPayment);

    try {
      const response = await createInvoice(Kg_id!, newPayment);
      onAddPayment(response.data);
      toast({
      title: t('financial.addSuccess'),
      description: t('financial.addTransaction'),
      });
      setForm({
        child_id: "",
        parent_id: "",
        amount_paid: 0,
        payment_method: "",
        payment_date: "",
        notes: ""
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to add payment:", error);
      toast({
        title: t("common.error"),
        description: t("financial.addError"),
        variant: "destructive",
      });
    }
  };

  return (
   <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('financial.addTransaction')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="child_id">{t('financial.childName')}</Label>
            <Select
              value={form.child_id}
              onValueChange={(value) => {
                const selectedChild = children.find(
                  (child) => child.id === value
                );
                setForm({
                  ...form,
                  child_id: value,
                  parent_id: selectedChild?.father_idno || "",
                });
              }}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={t("financial.childNamePlaceholder")}
                />
              </SelectTrigger>
              <SelectContent>
                {children.map((child) => (
                  <SelectItem key={child.id} value={child.id}>
                    {`${child.first_name} ${child.last_name}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount_paid">{t("financial.amount")}</Label>
            <Input
              id="amount_paid"
              type="number"
              value={form.amount_paid}
              onChange={(e) =>
                setForm({ ...form, amount_paid: Number(e.target.value) })
              }
              placeholder={t("financial.amountPlaceholder")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="payment_method">{t('financial.paymentMethod')}</Label>
            <Select
              value={form.payment_method}
              onValueChange={(value) => setForm({ ...form, payment_method: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('financial.paymentMethodPlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                {paymentMethods.map((method) => (
                  <SelectItem key={method.value} value={method.value}>
                    {t(method.labelKey)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="payment_date">{t('financial.paymentDate')}</Label>
            <Input
              id="payment_date"
              type="date"
              value={form.payment_date}
              onChange={(e) => setForm({ ...form, payment_date: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">{t('financial.notes')}</Label>
            <Input
              id="notes"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder={t('financial.notesPlaceholder')}
            />
          </div>
          <DialogFooter>
            <Button type="submit">{t('financial.addTransaction')}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
