import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
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
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { Child } from "@/api/Kindergarten/Children/childrenApis";

interface AbsenceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: {
    absence: string;
    date: string;
    time: string;
    note: string;
  }) => void;
  child: Child | null;
}

export const AbsenceDialog: React.FC<AbsenceDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  child,
}) => {
  const { t } = useTranslation();
  const { register, handleSubmit, reset, control, setValue } = useForm({
    defaultValues: {
      absence: "1",
      date: "",
      time: "",
      note: "",
    },
  });

  const handleOpenChange = (open: boolean) => {
    if (!open) reset();
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("children.absenceTitle")}</DialogTitle>
          <DialogDescription>
            {t("children.absenceDescription")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date">{t("children.absenceDate")}</Label>
            <Input
              id="date"
              type="date"
              {...register("date", { required: true })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="time">{t("children.absenceTime")}</Label>
            <Input
              id="time"
              type="time"
              {...register("time", { required: true })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="note">{t("children.absenceNote")}</Label>
            <Input
              id="note"
              {...register("note")}
              placeholder={t("children.absenceNotePlaceholder")}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              {t("common.cancel")}
            </Button>
            <Button
              type="submit"
              className="bg-[#1A5F5E] hover:bg-[#1A5F5E]/90"
            >
              {t("common.add")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
