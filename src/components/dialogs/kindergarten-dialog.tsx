import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTranslation } from 'react-i18next';
import { BaseDialog } from './base-dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from '@/components/ui/switch';
import { MultiSelect } from '@/components/ui/multi-select';
import { Kindergarten } from '@/types/kindergarten';
import { Plan } from '@/types/plan';

const kindergartenSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  address: z.string().min(1, 'Address is required'),
  phoneNumber: z.string().min(1, 'Phone number is required'),
  planIds: z.array(z.string()).length(1, 'Exactly one plan must be selected'),
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
      name: defaultValues?.name || '',
      address: defaultValues?.address || '',
      phoneNumber: defaultValues?.phoneNumber || '',
      planIds: defaultValues?.planIds || [],
    },
  });

  React.useEffect(() => {
    if (defaultValues) {
      reset({
        name: defaultValues.name,
        address: defaultValues.address,
        phoneNumber: defaultValues.phoneNumber,
        planIds: defaultValues.planIds || [],
      });
    }
  }, [defaultValues, reset]);

  const selectedPlanIds = watch('planIds');

  const formatPlanOption = (plan: Plan) => {
    const baseLabel = `${plan.name} ($${plan.cost})`;
    if (plan.discount > 0) {
      const discountedPrice = plan.cost * (1 - plan.discount / 100);
      return `${baseLabel} - ${plan.discount}% off ($${discountedPrice.toFixed(2)})`;
    }
    return baseLabel;
  };

  const handlePlanChange = (value: string[]) => {
    // If selecting a new plan, clear previous selection
    if (value.length > 0) {
      setValue('planIds', [value[value.length - 1]]);
    } else {
      setValue('planIds', []);
    }
  };

  return (
    <BaseDialog
      open={open}
      onOpenChange={onOpenChange}
      title={defaultValues ? t('kindergartens.edit') : t('kindergartens.add')}
      description={defaultValues ? t('kindergartens.editDescription') : t('kindergartens.addDescription')}
      onSubmit={handleSubmit(onSubmit)}
      isLoading={isLoading}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">{t('kindergartens.name')}</label>
          <Input
            id="name"
            {...register('name')}
            placeholder={t('kindergartens.namePlaceholder')}
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="address" className="text-sm font-medium">{t('kindergartens.address')}</label>
          <Input
            id="address"
            {...register('address')}
            placeholder={t('kindergartens.addressPlaceholder')}
          />
          {errors.address && (
            <p className="text-sm text-red-500">{errors.address.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="phoneNumber" className="text-sm font-medium">{t('kindergartens.phoneNumber')}</label>
          <Input
            id="phoneNumber"
            {...register('phoneNumber')}
            placeholder={t('kindergartens.phoneNumberPlaceholder')}
          />
          {errors.phoneNumber && (
            <p className="text-sm text-red-500">{errors.phoneNumber.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="plans" className="text-sm font-medium text-gray-700">
            {t('kindergartens.plans')}
          </label>
          <MultiSelect
            options={plans.map(plan => ({
              value: plan.id || '',
              label: formatPlanOption(plan)
            }))}
            value={selectedPlanIds}
            onChange={handlePlanChange}
            placeholder={t('kindergartens.selectPlans')}
          />
          {errors.planIds && (
            <p className="text-sm text-red-500 mt-1">{t('kindergartens.selectOnePlan')}</p>
          )}
        </div>
      </div>
    </BaseDialog>
  );
} 