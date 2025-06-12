import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTranslation } from 'react-i18next';
import { BaseDialog } from './base-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Plan } from '@/api/Subscribtion/Plans/PlanApis';

const planSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  cost: z.number().min(0, 'Cost must be greater than or equal to 0'),
  discount: z.number().min(0, 'Discount must be greater than or equal to 0'),
  enable: z.boolean().default(true),
  buildIn: z.boolean().default(false),
});

export type PlanFormData = z.infer<typeof planSchema>;

interface PlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: PlanFormData & { _id?: string }) => void;
  defaultValues?: Plan;
  isLoading?: boolean;
}

export function PlanDialog({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
  isLoading = false,
}: PlanDialogProps) {
  const { t } = useTranslation();
  const isEditMode = !!defaultValues?._id;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<PlanFormData>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      name: '',
      startDate: '',
      endDate: '',
      cost: 0,
      discount: 0,
      enable: true,
      buildIn: false,
      ...defaultValues,
    },
  });

  React.useEffect(() => {
    if (defaultValues) {
      reset({
        ...defaultValues,
        startDate: defaultValues.startDate ? new Date(defaultValues.startDate).toISOString().slice(0, 16) : '',
        endDate: defaultValues.endDate ? new Date(defaultValues.endDate).toISOString().slice(0, 16) : '',
      });
    }
  }, [defaultValues, reset]);

  const onFormSubmit = (data: PlanFormData) => {
    if (defaultValues?._id) {
      onSubmit({ ...data, _id: defaultValues._id });
    } else {
      onSubmit(data);
    }
  };

  return (
    <BaseDialog
      open={open}
      onOpenChange={onOpenChange}
      title={defaultValues ? t('plans.edit') : t('plans.add')}
      description={defaultValues ? t('plans.editDescription') : t('plans.addDescription')}
      onSubmit={handleSubmit(onFormSubmit)}
      isLoading={isLoading}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">{t('plans.name')}</Label>
          <Input
            id="name"
            {...register('name')}
            placeholder={t('plans.namePlaceholder')}
            disabled={isEditMode}
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="startDate">{t('plans.startDate')}</Label>
          <Input
            id="startDate"
            type="datetime-local"
            {...register('startDate')}
            disabled={isEditMode}
          />
          {errors.startDate && (
            <p className="text-sm text-red-500">{errors.startDate.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate">{t('plans.endDate')}</Label>
          <Input
            id="endDate"
            type="datetime-local"
            {...register('endDate')}
            disabled={isEditMode}
          />
          {errors.endDate && (
            <p className="text-sm text-red-500">{errors.endDate.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="cost">{t('plans.cost')}</Label>
          <Input
            id="cost"
            type="number"
            {...register('cost', { valueAsNumber: true })}
            placeholder={t('plans.costPlaceholder')}
            disabled={isEditMode}
          />
          {errors.cost && (
            <p className="text-sm text-red-500">{errors.cost.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="discount">{t('plans.discount')}</Label>
          <Input
            id="discount"
            type="number"
            {...register('discount', { valueAsNumber: true })}
            placeholder={t('plans.discountPlaceholder')}
            disabled={isEditMode}
          />
          {errors.discount && (
            <p className="text-sm text-red-500">{errors.discount.message}</p>
          )}
        </div>

        <Controller
          control={control}
          name="enable"
          render={({ field }) => (
            <div className="flex items-center space-x-2">
              <Switch
                id="enable"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
              <Label htmlFor="enable">{t('plans.enable')}</Label>
            </div>
          )}
        />

        <Controller
          control={control}
          name="buildIn"
          render={({ field }) => (
            <div className="flex items-center space-x-2">
              <Switch
                id="buildIn"
                checked={field.value}
                onCheckedChange={isEditMode ? undefined : field.onChange}
                disabled={isEditMode}
              />
              <Label htmlFor="buildIn">{t('plans.buildIn')}</Label>
            </div>
          )}
        />
      </div>
    </BaseDialog>
  );
}