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
import { Child } from '@/types/child';

const childSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  dateOfBirth: z.string().min(1, 'Birth date is required'),
  gender: z.enum(['male', 'female'], {
    required_error: 'Gender is required',
  }),
  parentId: z.string().min(1, 'Parent ID is required'),
  groupId: z.string().optional(),
});

interface ChildDialogProps {
  child?: Child;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Child) => void;
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
  const form = useForm<Child>({
    resolver: zodResolver(childSchema),
    defaultValues: child || {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: 'male',
      parentId: '',
      groupId: '',
    },
  });

  const handleSubmit = (data: Child) => {
    onSubmit(data);
  };

  return (
    <BaseDialog
      title={child ? t('children.edit') : t('children.add')}
      description={child ? t('children.editDescription') : t('children.addDescription')}
      open={open}
      onOpenChange={onOpenChange}
      onSubmit={form.handleSubmit(handleSubmit)}
      isLoading={isLoading}
    >
      <Form {...form}>
        <form className="space-y-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('table.headers.children.firstName')}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('table.headers.children.lastName')}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dateOfBirth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('table.headers.children.dateOfBirth')}</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('table.headers.children.gender')}</FormLabel>
                <FormControl>
                  <select {...field} className="w-full p-2 border rounded">
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="parentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('table.headers.children.parentId')}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="groupId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('table.headers.children.groupId')}</FormLabel>
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