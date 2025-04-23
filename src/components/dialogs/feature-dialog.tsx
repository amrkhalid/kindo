import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTranslation } from 'react-i18next';
import { BaseDialog } from './base-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Feature } from '@/types/feature';

const featureSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  enable: z.boolean().default(true),
  buildIn: z.boolean().default(false),
});

type FeatureFormData = z.infer<typeof featureSchema>;

interface FeatureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: FeatureFormData) => void;
  defaultValues?: Feature;
  isLoading?: boolean;
}

export function FeatureDialog({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
  isLoading = false,
}: FeatureDialogProps) {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FeatureFormData>({
    resolver: zodResolver(featureSchema),
    defaultValues: defaultValues,
  });

  React.useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  return (
    <BaseDialog
      open={open}
      onOpenChange={onOpenChange}
      title={defaultValues ? t('features.edit') : t('features.add')}
      description={defaultValues ? t('features.editDescription') : t('features.addDescription')}
      onSubmit={handleSubmit(onSubmit)}
      isLoading={isLoading}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">{t('features.name')}</Label>
          <Input
            id="name"
            {...register('name')}
            placeholder={t('features.namePlaceholder')}
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="enable"
            {...register('enable')}
          />
          <Label htmlFor="enable">{t('features.enable')}</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="buildIn"
            {...register('buildIn')}
          />
          <Label htmlFor="buildIn">{t('features.buildIn')}</Label>
        </div>
      </div>
    </BaseDialog>
  );
} 