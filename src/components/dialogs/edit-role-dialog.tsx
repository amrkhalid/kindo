import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Role } from "@/types";
import { useTranslation } from "react-i18next";

interface EditRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEditRole:(data: { role: string }) => void;
  role: any;
}

export function EditRoleDialog({
  open,
  onOpenChange,
  onEditRole,
}: EditRoleDialogProps) {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [form, setForm] = useState({
    role: "staff",
  });


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
    setForm({  role: "staff" });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Staff Role</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select
              value={form.role}
              onValueChange={(value: Role) => setForm({ ...form, role: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
              <SelectItem value="manager">
                  {t("roles.manager", "Manager")}
                </SelectItem>
                <SelectItem value="staff">
                  {t("roles.staff", "Staff")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="submit">Update Role</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 