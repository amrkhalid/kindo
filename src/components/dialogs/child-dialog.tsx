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
import { Child } from '@/api/Kindergarten/Children/childrenApis';

const childSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  second_name: z.string().min(1, 'Second name is required'),
  third_name: z.string().min(1, 'Third name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  birth_date: z.string().min(1, 'Birth date is required'),
  father_idno: z.string().min(1, 'Father ID is required'),
  mother_idno: z.string().min(1, 'Mother ID is required'),
  // gender: z.enum(['male', 'female'], {
  //   required_error: 'Gender is required',
  // }),
  // parentId: z.string().min(1, 'Parent ID is required'),
  // groupId: z.string().optional(),
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
      first_name: '',
      second_name: '',
      third_name: '',
      last_name: '',
      birth_date: '',
      father_idno: '',
      mother_idno: '',
      ...child,
    },
  });

  const handleSubmit = (data: any) => {
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
            name="first_name"
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
            name="second_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('table.headers.children.secondName')}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="third_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('table.headers.children.thirdName')}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="last_name"
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
            name="birth_date"
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
            name="father_idno"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('table.headers.children.fatherIdNumber')}</FormLabel>
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
                <FormLabel>{t('table.headers.children.motherIdNumber')}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* <FormField
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
          */}
        </form>
      </Form>
    </BaseDialog>
  );
}