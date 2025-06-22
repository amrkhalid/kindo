import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";
import { Child } from "@/api/Kindergarten/Children/childrenApis";

interface LeaveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { date: string; time: string; note: string }) => void;
  child: Child | null;
}

export const LeaveDialog: React.FC<LeaveDialogProps> = ({ open, onOpenChange, onSubmit, child }) => {
  const { t } = useTranslation();
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      date: "",
      time: "",
      note: ""
    }
  });

  const handleOpenChange = (open: boolean) => {
    if (!open) reset();
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("children.leaveTitle")}</DialogTitle>
          <DialogDescription>
            {t("children.leaveDescription", { name: child ? `${child.first_name} ${child.last_name}` : "" })}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date">{t("children.leaveDate")}</Label>
            <Input
              id="date"
              type="date"
              {...register("date", { required: true })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="time">{t("children.leaveTime")}</Label>
            <Input
              id="time"
              type="time"
              {...register("time", { required: true })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="note">{t("children.leaveNote")}</Label>
            <Input
              id="note"
              {...register("note")}
              placeholder={t("children.leaveNotePlaceholder")}
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
            <Button type="submit" className="bg-[#1A5F5E] hover:bg-[#1A5F5E]/90">
              {t("common.add")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};