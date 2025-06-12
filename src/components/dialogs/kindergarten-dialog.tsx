import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslation } from "react-i18next";
import { BaseDialog } from "./base-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { MultiSelect } from "@/components/ui/multi-select";
import { Plan, Kindergarten } from "@/api/Kindergarten/Kindergartens/kindergartenApis";

const kindergartenSchema = z.object({
  name: z.string().min(1, "Name is required"),
  address: z.string().min(1, "Address is required"),
  phone_number: z.string().min(1, "Phone number is required"),
  plan_id: z.string().min(1, "Plan is required"),
});

type KindergartenFormData = z.infer<typeof kindergartenSchema>;

interface KindergartenDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: KindergartenFormData) => void;
  defaultValues?: Kindergarten;
  isLoading?: boolean;
  plans?: Plan[];
}

export function KindergartenDialog({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
  isLoading = false,
  plans = [],
}: KindergartenDialogProps) {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<KindergartenFormData>({
    resolver: zodResolver(kindergartenSchema),
    defaultValues: {
      name: defaultValues?.name || "",
      address: defaultValues?.address || "",
      phone_number: defaultValues?.phone_number || "",
      plan_id: defaultValues?.plan_id || "",
    },
  });

  React.useEffect(() => {
    if (defaultValues) {
      reset({
        name: defaultValues.name,
        address: defaultValues.address,
        phone_number: defaultValues.phone_number,
        plan_id: defaultValues.plan_id || "",
      });
    }
  }, [defaultValues, reset]);

  const selectedPlanId = watch("plan_id");

  const formatPlanOption = (plan: Plan) => {
    const baseLabel = `${plan.name} ($${plan.cost})`;
    if (plan.discount > 0) {
      const discountedPrice = plan.cost * (1 - plan.discount / 100);
      return `${baseLabel} - ${plan.discount}% off ($${discountedPrice.toFixed(
        2
      )})`;
    }
    return baseLabel;
  };

  const handlePlanChange = (value: string[]) => {
    setValue("plan_id", value.length > 0 ? value[value.length - 1] : "");
  };

  return (
    <BaseDialog
      open={open}
      onOpenChange={onOpenChange}
      title={defaultValues ? t("kindergartens.edit") : t("kindergartens.add")}
      description={
        defaultValues
          ? t("kindergartens.editDescription")
          : t("kindergartens.addDescription")
      }
      onSubmit={handleSubmit(onSubmit)}
      isLoading={isLoading}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            {t("kindergartens.name")}
          </label>
          <Input
            id="name"
            {...register("name")}
            placeholder={t("kindergartens.namePlaceholder")}
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="address" className="text-sm font-medium">
            {t("kindergartens.address")}
          </label>
          <Input
            id="address"
            {...register("address")}
            placeholder={t("kindergartens.addressPlaceholder")}
          />
          {errors.address && (
            <p className="text-sm text-red-500">{errors.address.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="phone_number" className="text-sm font-medium">
            {t("kindergartens.phoneNumber")}
          </label>
          <Input
            id="phone_number"
            {...register("phone_number")}
            placeholder={t("kindergartens.phoneNumberPlaceholder")}
          />
          {errors.phone_number && (
            <p className="text-sm text-red-500">
              {errors.phone_number.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="plans" className="text-sm font-medium text-gray-700">
            {t("kindergartens.plans")}
          </label>
          <MultiSelect
            options={plans.map((plan) => ({
              value: plan.id || "",
              label: formatPlanOption(plan),
            }))}
            value={selectedPlanId ? [selectedPlanId] : []}
            onChange={handlePlanChange}
            placeholder={t("kindergartens.selectPlans")}
          />
          {errors.plan_id && (
            <p className="text-sm text-red-500 mt-1">
              {errors.plan_id.message}
            </p>
          )}
        </div>
      </div>
    </BaseDialog>
  );
}
