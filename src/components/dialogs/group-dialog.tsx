import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { BaseDialog } from "./base-dialog";
import { useTranslation } from "react-i18next";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Group } from "@/api/Kindergarten/Group/groupApis";
import { Staff } from "@/api/Kindergarten/Group_staff/staffApis";
import { Child } from "@/api/Kindergarten/Children/childrenApis";

type GroupFormData = {
  name: string;
  staffId?: string;
  childrenIds?: string[];
};

interface GroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: GroupFormData) => void;
  defaultValues?: any | null;
  isLoading?: boolean;
  staffList?: Staff[];
  childrenList?: Child[];
  isEditMode?: boolean;
}

export function GroupDialog({
  defaultValues,
  open,
  onOpenChange,
  onSubmit,
  isLoading = false,
  staffList = [],
  childrenList = [],
  isEditMode = false,
}: GroupDialogProps) {
  const { t } = useTranslation();

  const groupSchema = z.object({
    name: z.string().min(1, "Group name is required"),
    staffId: isEditMode ? z.any() : z.string(),
    childrenIds: isEditMode
      ? z.any()
      : z.array(z.string()),
  });

  const form = useForm<GroupFormData>({
    resolver: zodResolver(groupSchema),
    defaultValues: defaultValues
      ? {
          name: defaultValues.name,
          staffId: defaultValues.staffId || "",
          childrenIds: defaultValues.childrenIds || [],
        }
      : {
          name: "",
          staffId: "",
          childrenIds: [],
        },
  });

  useEffect(() => {
    if (defaultValues) {
      form.reset({
        name: defaultValues.name,
      });
    } else {
      form.reset({
        name: "",
      });
    }
  }, [defaultValues, open]);

  const handleSubmit = (data: GroupFormData) => {
    onSubmit(data);
  };

  const getStaffName = (staff: Staff) => {
    return `${staff.user.first_name} ${staff.user.last_name}`;
  };

  const getChildName = (child: Child) => {
    return `${child.first_name} ${child.last_name}`;
  };

  const handleChildSelect = (value: string) => {
    const currentValues = form.getValues("childrenIds") || [];
    if (currentValues.includes(value)) {
      form.setValue(
        "childrenIds",
        currentValues.filter((id) => id !== value)
      );
    } else {
      form.setValue("childrenIds", [...currentValues, value]);
    }
  };

  return (
    <BaseDialog
      title={defaultValues ? t("groups.edit") : t("groups.add")}
      description={
        defaultValues ? t("groups.editDescription") : t("groups.addDescription")
      }
      open={open}
      onOpenChange={onOpenChange}
      onSubmit={form.handleSubmit(handleSubmit)}
      isLoading={isLoading}
    >
      <Form {...form}>
        <form className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("table.headers.groups.name")}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {!isEditMode && (
            <FormField
              control={form.control}
              name="staffId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("groups.staff")}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("groups.selectStaff")}>
                          {field.value
                            ? `${getStaffName(
                                staffList.find((s) => s.id === field.value)!
                              )} (${
                                staffList.find((s) => s.id === field.value)
                                  ?.role
                              })`
                            : t("groups.selectStaff")}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="max-h-48" searchable searchPlaceholder="Search staff...">
                      {staffList.map((staff) => (
                        <SelectItem key={staff.id} value={staff.id}>
                          {getStaffName(staff)} ({staff.role})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {!isEditMode && (
            <FormField
              control={form.control}
              name="childrenIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("groups.children")}</FormLabel>
                  <Select onValueChange={handleChildSelect} value="">
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("groups.selectChildren")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="max-h-48" searchable searchPlaceholder="Search child...">
                      {childrenList.map((child) => (
                        <SelectItem
                          key={child.id}
                          value={child.id}
                          className={
                            field.value?.includes(child.id) ? "bg-gray-100" : ""
                          }
                        >
                          {getChildName(child)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {field.value?.map((childId) => {
                      const child = childrenList.find((c) => c.id === childId);
                      return child ? (
                        <span
                          key={childId}
                          className="bg-gray-100 px-2 py-1 rounded text-sm flex items-center gap-1"
                        >
                          {getChildName(child)}
                          <button
                            type="button"
                            onClick={() => handleChildSelect(childId)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            ×
                          </button>
                        </span>
                      ) : null;
                    })}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </form>
      </Form>
    </BaseDialog>
  );
}