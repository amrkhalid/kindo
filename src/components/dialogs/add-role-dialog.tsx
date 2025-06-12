import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

interface AddRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddRole: (data: { identity: string; role: string }) => void;
}

export function AddRoleDialog({
  open,
  onOpenChange,
  onAddRole,
}: AddRoleDialogProps) {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [form, setForm] = useState({
    identity: "",
    role: "staff",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.identity || !form.role) {
      toast({
        title: t("common.error"),
        description: t("common.required"),
        variant: "destructive",
      });
      return;
    }

    onAddRole(form);
    setForm({ identity: "", role: "staff" });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("roles.modal.addStaffRoleTitle")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="identity">{t("roles.modal.idNumber")}</Label>
            <Input
              id="identity"
              value={form.identity}
              onChange={(e) => setForm({ ...form, identity: e.target.value })}
              placeholder={t("roles.modal.idNumberPlaceholder")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">{t("roles.modal.role")}</Label>
            <Select
              value={form.role}
              onValueChange={(value) => setForm({ ...form, role: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("roles.modal.rolePlaceholder")} />
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
            <Button type="submit">{t("roles.modal.addRole")}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
