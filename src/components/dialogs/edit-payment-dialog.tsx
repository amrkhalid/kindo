import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

interface Payment {
  amount_paid: number;
}

interface EditPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEditPayment: (data: { amount_paid: number }) => void;
  payment: Payment;
}

export function EditPaymentDialog({
  open,
  onOpenChange,
  onEditPayment,
  payment,
}: EditPaymentDialogProps) {
  const { toast } = useToast();
  const { t } = useTranslation();

  const [form, setForm] = useState({ amount_paid: 0 });

  useEffect(() => {
    if (payment && open) {
      setForm({
        amount_paid: payment.amount_paid || 0,
      });
    }
  }, [payment, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.amount_paid) {
      toast({
        title: t("common.error"),
        description: t("common.required"),
        variant: "destructive",
      });
      return;
    }

    onEditPayment(form);
    setForm({ amount_paid: 0 });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("financial.edit")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount_paid">{t("financial.amountPlaceholder")}</Label>
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
          <DialogFooter>
            <Button type="submit">{t("common.save")}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
