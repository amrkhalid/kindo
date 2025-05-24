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
import { Child } from "@/api/Kindergarten/Children/childrenApis";

const childSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  second_name: z.string().min(1, "Second name is required"),
  third_name: z.string().min(1, "Third name is required"),
  last_name: z.string().min(1, "Last name is required"),
  birth_date: z.string().min(1, "Birth date is required"),
  father_idno: z.string().min(1, "Father ID is required"),
  mother_idno: z.string().min(1, "Mother ID is required"),
});

interface ChildDialogProps {
  child?: Partial<Child>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

export function ChildDialog({
  child,
  open,
  onOpenChange,
  onSubmit,
  isLoading = false,
}: ChildDialogProps) {
  const { t } = useTranslation();

  const form = useForm({
    resolver: zodResolver(childSchema),
    defaultValues: {
      first_name: "",
      second_name: "",
      third_name: "",
      last_name: "",
      birth_date: "",
      father_idno: "",
      mother_idno: "",
      ...child,
    },
  });

  useEffect(() => {
    if (open && child) {
      form.reset({
        first_name: child.first_name ?? "",
        second_name: child.second_name ?? "",
        third_name: child.third_name ?? "",
        last_name: child.last_name ?? "",
        birth_date: child.birth_date?.slice(0, 10) ?? "",
        father_idno: child.fatheruser?.id_no ?? "",
        mother_idno: child.motheruser?.id_no ?? "",
      });
    }
  }, [child, open, form]);

  const handleSubmit = (data: any) => {
    onSubmit(data);
  };

  return (
    <BaseDialog
      title={child ? t("children.edit") : t("children.add")}
      description={
        child ? t("children.editDescription") : t("children.addDescription")
      }
      open={open}
      onOpenChange={onOpenChange}
      onSubmit={form.handleSubmit(handleSubmit)}
      isLoading={isLoading}
    >
      <Form {...form}>
        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("table.headers.children.firstName")}
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-1.5">
              <FormField
                control={form.control}
                name="second_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("table.headers.children.secondName")}
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <FormField
                control={form.control}
                name="third_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("table.headers.children.thirdName")}
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-1.5">
              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("table.headers.children.lastName")}
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <FormField
            control={form.control}
            name="birth_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("table.headers.children.dateOfBirth")}</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="father_idno"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t("table.headers.children.fatherIdNumber")}
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="mother_idno"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t("table.headers.children.motherIdNumber")}
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </BaseDialog>
  );
}