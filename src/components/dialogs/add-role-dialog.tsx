import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Role as RoleType } from "@/types";
import { useTranslation } from 'react-i18next';

interface AddRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddRole: (role: {
    id: string;
    username: string;
    email: string;
    identity: string;
    role: RoleType;
    joinDate: string;
    createdAt: string;
  }) => void;
}

export function AddRoleDialog({
  open,
  onOpenChange,
  onAddRole,
}: AddRoleDialogProps) {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [form, setForm] = useState<{
    username: string;
    email: string;
    identity: string;
    role: RoleType;
  }>({
    username: "",
    email: "",
    identity: "",
    role: "staff",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.username || !form.email || !form.identity) {
      toast({
        title: t('common.error'),
        description: t('common.required'),
        variant: "destructive",
      });
      return;
    }

    const newRole = {
      ...form,
      id: crypto.randomUUID(),
      joinDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    onAddRole(newRole);
    toast({
      title: t('roles.addSuccess'),
      description: `${form.username} ${t('roles.addDescription')}`,
      variant: "success"
    });
    setForm({
      username: "",
      email: "",
      identity: "",
      role: "staff",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('roles.modal.addStaffRoleTitle')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">{t('roles.modal.username')}</Label>
            <Input
              id="username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              placeholder={t('roles.modal.usernamePlaceholder')}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">{t('roles.modal.email')}</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder={t('roles.modal.emailPlaceholder')}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="identity">{t('roles.modal.idNumber')}</Label>
            <Input
              id="identity"
              value={form.identity}
              onChange={(e) => setForm({ ...form, identity: e.target.value })}
              placeholder={t('roles.modal.idNumberPlaceholder')}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">{t('roles.modal.role')}</Label>
            <Select
              value={form.role}
              onValueChange={(value: RoleType) => setForm({ ...form, role: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('roles.modal.rolePlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manager">{t('roles.manager', 'Manager')}</SelectItem>
                <SelectItem value="staff">{t('roles.staff', 'Staff')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="submit">{t('roles.modal.addRole')}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
