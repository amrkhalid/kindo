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
  onAddRole: (data: {
    firstName: string;
    lastName: string;
    identity: string;
    gender: string;
    email: string;
    phoneNumber: string;
    role: string;
  }) => void;
}

export function AddRoleDialog({
  open,
  onOpenChange,
  onAddRole,
}: AddRoleDialogProps) {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    identity: "",
    gender: "",
    email: "",
    phoneNumber: "",
    role: "staff",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.firstName || !form.lastName || !form.identity || !form.role) {
      toast({
        title: t("common.error"),
        description: t("common.required"),
        variant: "destructive",
      });
      return;
    }

    onAddRole(form);
    setForm({
      firstName: "",
      lastName: "",
      identity: "",
      gender: "",
      email: "",
      phoneNumber: "",
      role: "staff",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{t("roles.modal.addStaffRoleTitle")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">{t("roles.modal.firstName")}</Label>
              <Input
                id="firstName"
                value={form.firstName}
                onChange={(e) =>
                  setForm({ ...form, firstName: e.target.value })
                }
                placeholder={t("roles.modal.firstNamePlaceholder")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">{t("roles.modal.lastName")}</Label>
              <Input
                id="lastName"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                placeholder={t("roles.modal.lastNamePlaceholder")}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="idNumber">{t("roles.modal.idNumber")}</Label>
              <Input
                id="idNumber"
                value={form.identity}
                onChange={(e) => setForm({ ...form, identity: e.target.value })}
                placeholder={t("roles.modal.idNumberPlaceholder")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">{t("roles.modal.gender")}</Label>
              <Select
                value={form.gender}
                onValueChange={(value) => setForm({ ...form, gender: value })}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={t("roles.modal.genderPlaceholder")}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">{t("roles.modal.male")}</SelectItem>
                  <SelectItem value="female">
                    {t("roles.modal.female")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t("roles.modal.email")}</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder={t("roles.modal.emailPlaceholder")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">
                {t("roles.modal.phoneNumber")}
              </Label>
              <Input
                id="phoneNumber"
                value={form.phoneNumber}
                onChange={(e) =>
                  setForm({ ...form, phoneNumber: e.target.value })
                }
                placeholder={t("roles.modal.phoneNumberPlaceholder")}
              />
            </div>
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
