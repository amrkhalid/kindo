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

export interface Group {
  id: string;
  name: string;
  description: string;
  capacity: number;
  children: Child[];
  staffName: string;
  createdAt: string;
  updatedAt: string;
}

const groupSchema = z.object({
  name: z.string().min(1, 'Group name is required'),
  description: z.string(),
  capacity: z.coerce.number().min(1, 'Capacity must be at least 1'),
  staffName: z.string().min(1, 'Staff name is required'),
});

interface GroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Omit<Group, 'id' | 'createdAt' | 'updatedAt' | 'children'>) => void;
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
  const form = useForm<Omit<Group, 'id' | 'createdAt' | 'updatedAt' | 'children'>>({
    resolver: zodResolver(groupSchema),
    defaultValues: defaultValues ? {
      name: defaultValues.name,
      description: defaultValues.description,
      capacity: defaultValues.capacity,
      staffName: defaultValues.staffName,
    } : {
      name: '',
      description: '',
      capacity: 15,
      staffName: '',
    },
  });

  const handleSubmit = (data: Omit<Group, 'id' | 'createdAt' | 'updatedAt' | 'children'>) => {
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
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('table.headers.groups.description')}</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="capacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('table.headers.groups.capacity')}</FormLabel>
                <FormControl>
                  <Input type="number" min={1} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="staffName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('table.headers.groups.staffName')}</FormLabel>
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