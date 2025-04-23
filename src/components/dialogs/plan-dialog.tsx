import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { BaseDialog } from './base-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Plan, PlanRequest } from '@/types/plan';
import { MultiSelect } from '@/components/ui/multi-select';

interface PlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan?: Plan;
  onSubmit: (data: PlanRequest) => void;
}

const planSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  cost: z.number().min(0, 'Cost must be greater than or equal to 0'),
  discount: z.number().min(0, 'Discount must be greater than or equal to 0'),
  enable: z.boolean(),
  buildIn: z.boolean(),
});

// Mock features data - replace with actual API call
const features = [
  { id: 'attendance', name: 'Attendance Tracking' },
  { id: 'parent_portal', name: 'Parent Portal' },
  { id: 'teacher_portal', name: 'Teacher Portal' },
  { id: 'student_profiles', name: 'Student Profiles' },
  { id: 'class_schedules', name: 'Class Schedules' },
  { id: 'meal_plans', name: 'Meal Plans' },
  { id: 'activity_logs', name: 'Activity Logs' },
  { id: 'progress_reports', name: 'Progress Reports' },
  { id: 'photo_gallery', name: 'Photo Gallery' },
  { id: 'messaging', name: 'Messaging System' },
  { id: 'payment_processing', name: 'Payment Processing' },
  { id: 'event_management', name: 'Event Management' },
  { id: 'document_storage', name: 'Document Storage' },
  { id: 'emergency_contacts', name: 'Emergency Contacts' },
  { id: 'health_records', name: 'Health Records' },
  { id: 'transportation', name: 'Transportation Management' },
  { id: 'curriculum_planning', name: 'Curriculum Planning' },
  { id: 'staff_management', name: 'Staff Management' },
  { id: 'inventory_management', name: 'Inventory Management' },
  { id: 'reporting', name: 'Reporting & Analytics' }
];

export function PlanDialog({ open, onOpenChange, plan, onSubmit }: PlanDialogProps) {
  const { t } = useTranslation();
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  const form = useForm<z.infer<typeof planSchema>>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      name: plan?.name || '',
      startDate: plan?.startDate || '',
      endDate: plan?.endDate || '',
      cost: plan?.cost || 0,
      discount: plan?.discount || 0,
      enable: plan?.enable ?? true,
      buildIn: plan?.buildIn ?? false,
    },
  });

  useEffect(() => {
    if (open) {
      // Reset form and selected features when dialog opens
      form.reset({
        name: plan?.name || '',
        startDate: plan?.startDate || '',
        endDate: plan?.endDate || '',
        cost: plan?.cost || 0,
        discount: plan?.discount || 0,
        enable: plan?.enable ?? true,
        buildIn: plan?.buildIn ?? false,
      });
      // TODO: Load plan features from API when editing
      setSelectedFeatures([]);
    }
  }, [open, plan, form]);

  const handleSubmit = (data: z.infer<typeof planSchema>) => {
    const planData: Omit<Plan, 'id' | 'createdAt' | 'updatedAt'> = {
      name: data.name,
      startDate: data.startDate,
      endDate: data.endDate,
      cost: data.cost,
      discount: data.discount,
      enable: data.enable,
      buildIn: data.buildIn,
    };

    onSubmit({
      planData,
      features: selectedFeatures,
    });
  };

  return (
    <BaseDialog
      open={open}
      onOpenChange={onOpenChange}
      title={plan ? t('plans.editPlan') : t('plans.addPlan')}
      description={t('plans.planDialogDescription')}
    >
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">{t('plans.name')}</Label>
          <Input
            id="name"
            {...form.register('name')}
            placeholder={t('plans.namePlaceholder')}
          />
          {form.formState.errors.name && (
            <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="startDate">{t('plans.startDate')}</Label>
          <Input
            id="startDate"
            type="datetime-local"
            {...form.register('startDate')}
          />
          {form.formState.errors.startDate && (
            <p className="text-sm text-red-500">{form.formState.errors.startDate.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate">{t('plans.endDate')}</Label>
          <Input
            id="endDate"
            type="datetime-local"
            {...form.register('endDate')}
          />
          {form.formState.errors.endDate && (
            <p className="text-sm text-red-500">{form.formState.errors.endDate.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="cost">{t('plans.cost')}</Label>
          <Input
            id="cost"
            type="number"
            {...form.register('cost', { valueAsNumber: true })}
            placeholder={t('plans.costPlaceholder')}
          />
          {form.formState.errors.cost && (
            <p className="text-sm text-red-500">{form.formState.errors.cost.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="discount">{t('plans.discount')}</Label>
          <Input
            id="discount"
            type="number"
            {...form.register('discount', { valueAsNumber: true })}
            placeholder={t('plans.discountPlaceholder')}
          />
          {form.formState.errors.discount && (
            <p className="text-sm text-red-500">{form.formState.errors.discount.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="features">{t('plans.features')}</Label>
          <MultiSelect
            options={features.map(f => ({ value: f.id, label: f.name }))}
            value={selectedFeatures}
            onChange={setSelectedFeatures}
            placeholder={t('plans.selectFeatures')}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="enable"
            checked={form.watch('enable')}
            onCheckedChange={(checked) => form.setValue('enable', checked)}
          />
          <Label htmlFor="enable">{t('plans.enable')}</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="buildIn"
            checked={form.watch('buildIn')}
            onCheckedChange={(checked) => form.setValue('buildIn', checked)}
          />
          <Label htmlFor="buildIn">{t('plans.buildIn')}</Label>
        </div>

        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            {t('common.cancel')}
          </Button>
          <Button type="submit">
            {plan ? t('common.save') : t('common.add')}
          </Button>
        </div>
      </form>
    </BaseDialog>
  );
} 