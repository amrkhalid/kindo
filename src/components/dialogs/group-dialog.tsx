import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { BaseDialog } from './base-dialog';
import { useTranslation } from 'react-i18next';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Child } from '@/types/child';
import { Group } from '@/api/Kindergarten/Group/groupApis';


const groupSchema = z.object({
  name: z.string().min(1, 'Group name is required'),
});

interface GroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Omit<Group, 'id' | 'createdAt' | 'updatedAt'>) => void;
  defaultValues?: Group | null;
  isLoading?: boolean;
}

export function GroupDialog({
  defaultValues,
  open,
  onOpenChange,
  onSubmit,
  isLoading = false,
}: GroupDialogProps) {
  const { t } = useTranslation();
  const form = useForm<Omit<Group, 'id' | 'createdAt' | 'updatedAt'>>({
    resolver: zodResolver(groupSchema),
    defaultValues: defaultValues ? {
      name: defaultValues.name,
    } : {
      name: '',
    },
  });

  const handleSubmit = (data: Omit<Group, 'id' | 'createdAt' | 'updatedAt'>) => {
    onSubmit(data);
  };

  return (
    <BaseDialog
      title={defaultValues ? t('groups.edit') : t('groups.add')}
      description={defaultValues ? t('groups.editDescription') : t('groups.addDescription')}
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
                <FormLabel>{t('table.headers.groups.name')}</FormLabel>
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