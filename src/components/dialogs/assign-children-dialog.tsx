import React from "react";
import { useTranslation } from "react-i18next";
import { BaseDialog } from "./base-dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Group } from "@/api/Kindergarten/Group/groupApis";
import { Child } from "@/api/Kindergarten/Children/childrenApis";

interface AssignChildrenDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (group: Group) => void;
  child: Child | null;
  groups: Group[];
  isLoading?: boolean;
}

export function AssignChildrenDialog({
  open,
  onOpenChange,
  onSubmit,
  child,
  groups,
  isLoading = false,
}: AssignChildrenDialogProps) {
  const { t } = useTranslation();
  const [selectedGroup, setSelectedGroup] = React.useState<Group | null>(null);

const handleSubmit = (e?: React.FormEvent) => {
  if (e) e.preventDefault();
    if (selectedGroup) {
      onSubmit(selectedGroup);
    }
  };

  const getChildFullName = (child: Child) => {
    return [
      child.first_name,
      child.second_name,
      child.third_name,
      child.last_name,
    ]
      .filter(Boolean)
      .join(" ");
  };

  return (
    <BaseDialog
      open={open}
      onOpenChange={onOpenChange}
      title={t("groups.assignChild")}
      description={t("groups.assignChildDescription")}
      onSubmit={handleSubmit}
      isLoading={isLoading}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>{t("groups.selectGroup")}</Label>
          <Select
            value={selectedGroup?.id || ""}
            onValueChange={(value) => {
              const group = groups.find((g) => g.id === value);
              setSelectedGroup(group || null);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("groups.selectGroupPlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              {groups.map((group) => (
                <SelectItem key={group.id} value={group.id}>
                  {group.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {child && (
          <div className="space-y-2">
            <Label>{t("groups.selectedChild")}</Label>
            <div className="border rounded-md p-2">
              <div className="py-1">{getChildFullName(child)}</div>
            </div>
          </div>
        )}
      </div>
    </BaseDialog>
  );
}