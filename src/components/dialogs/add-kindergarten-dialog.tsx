import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { Kindergarten } from "@/types";

interface AddKindergartenDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddKindergarten: (kindergarten: Kindergarten) => void;
}

export function AddKindergartenDialog({
  open,
  onOpenChange,
  onAddKindergarten,
}: AddKindergartenDialogProps) {
  const { toast } = useToast();
  const { t } = useTranslation();
  const isRTL = t('dir') === 'rtl';
  const [form, setForm] = useState({
    name: "",
    address: "",
    phoneNumber: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.address || !form.phoneNumber) {
      toast({
        title: t('common.error'),
        description: t('common.required'),
        variant: "destructive",
      });
      return;
    }

    const newKindergarten = {
      ...form,
      id: crypto.randomUUID(),
      joinDate: new Date().toISOString(),
      createdBy: "Current User", // This would come from auth context
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onAddKindergarten(newKindergarten);
    toast({
      title: t('common.success'),
      description: t('kindergartens.addSuccess'),
      variant: "success"
    });
    
    // Reset form and close dialog
    setForm({
      name: "",
      address: "",
      phoneNumber: "",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn("sm:max-w-[425px]", isRTL ? "rtl" : "ltr")}>
        <DialogHeader>
          <DialogTitle>{t('kindergartens.add')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t('kindergartens.name')}</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder={t('kindergartens.namePlaceholder')}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">{t('kindergartens.address')}</Label>
            <Input
              id="address"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder={t('kindergartens.addressPlaceholder')}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">{t('kindergartens.phoneNumber')}</Label>
            <Input
              id="phoneNumber"
              value={form.phoneNumber}
              onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
              placeholder={t('kindergartens.phoneNumberPlaceholder')}
            />
          </div>
          <DialogFooter>
            <Button type="submit">{t('kindergartens.add')}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
