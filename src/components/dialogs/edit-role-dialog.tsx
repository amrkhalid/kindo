import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

interface EditRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEditRole: (data: { role: string }) => void;
  role: any;
}

export function EditRoleDialog({
  open,
  onOpenChange,
  onEditRole,
  role,
}: EditRoleDialogProps) {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [form, setForm] = useState<{ role: string }>({ role: "staff" });

  useEffect(() => {
    if (role && open) {
      setForm({ role: role.role || "staff" });
    }
  }, [role, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.role) {
      toast({
        title: t("common.error"),
        description: t("common.required"),
        variant: "destructive",
      });
      return;
    }

    onEditRole(form);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{t("roles.modal.editTitle")}</DialogTitle>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <label className="block text-sm font-medium">
              {t("roles.modal.role")}
            </label>
            <Select
              value={form.role}
              onValueChange={(value) =>
                setForm((prev) => ({ ...prev, role: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder={t("roles.modal.role")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manager">
                  {t("roles.manager", "Manager")}
                </SelectItem>
                <SelectItem value="staff">
                  {t("roles.staff", "Staff")}
                </SelectItem>
                <SelectItem value="secretary">
                  {t("roles.secretary", "Secretary")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="submit">{t("common.save")}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}