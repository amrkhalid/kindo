import React, { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Plan, PlanRequest } from '@/types/plan';
import { Column } from '@/types/data-table';
import { DeleteDialog } from '@/components/dialogs/delete-dialog';
import { PlanDialog } from '@/components/dialogs/plan-dialog';
import { useToast } from '@/hooks/use-toast';

// Mock data - replace with actual API calls
const initialPlans: Plan[] = [
  {
    id: "1",
    name: "Basic Plan",
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    cost: 99.99,
    discount: 0,
    enable: true,
    buildIn: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Premium Plan",
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    cost: 199.99,
    discount: 10,
    enable: true,
    buildIn: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const PlansPage: React.FC = () => {
  const { toast } = useToast();
  const [plans, setPlans] = useState<Plan[]>(initialPlans);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { t, i18n } = useTranslation();
  
  // List of available languages with their directions
  const languages = [
    { code: 'en', label: 'English', dir: 'ltr' },
    { code: 'ar', label: 'العربية', dir: 'rtl' },
    { code: 'he', label: 'עברית', dir: 'rtl' }
  ];

  const isRTL = languages.find(lang => lang.code === i18n.language)?.dir === 'rtl';

  const columns: Column<Plan>[] = [
    {
      key: 'name' as keyof Plan,
      title: t('table.headers.plans.name'),
      render: (value: string) => (
        <div className={cn(
          "font-medium text-[#1A5F5E]",
          isRTL ? "text-right" : "text-left"
        )}>
          {value}
        </div>
      ),
    },
    {
      key: 'startDate' as keyof Plan,
      title: t('table.headers.plans.startDate'),
      render: (value: string) => (
        <div className={cn(
          "text-gray-600",
          isRTL ? "text-right" : "text-left"
        )}>
          {new Date(value).toLocaleDateString()}
        </div>
      ),
    },
    {
      key: 'endDate' as keyof Plan,
      title: t('table.headers.plans.endDate'),
      render: (value: string) => (
        <div className={cn(
          "text-gray-600",
          isRTL ? "text-right" : "text-left"
        )}>
          {new Date(value).toLocaleDateString()}
        </div>
      ),
    },
    {
      key: 'cost' as keyof Plan,
      title: t('table.headers.plans.cost'),
      render: (value: number) => (
        <div className={cn(
          "text-gray-600",
          isRTL ? "text-right" : "text-left"
        )}>
          ${value.toFixed(2)}
        </div>
      ),
    },
    {
      key: 'discount' as keyof Plan,
      title: t('table.headers.plans.discount'),
      render: (value: number) => (
        <div className={cn(
          "text-gray-600",
          isRTL ? "text-right" : "text-left"
        )}>
          {value}%
        </div>
      ),
    },
    {
      key: 'enable' as keyof Plan,
      title: t('table.headers.plans.enable'),
      render: (value: boolean) => (
        <Badge className={value ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
          {value ? t('common.enabled') : t('common.disabled')}
        </Badge>
      ),
    },
    {
      key: 'buildIn' as keyof Plan,
      title: t('table.headers.plans.buildIn'),
      render: (value: boolean) => (
        <Badge className={value ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}>
          {value ? t('common.yes') : t('common.no')}
        </Badge>
      ),
    },
  ];

  const handleAddPlan = async (data: PlanRequest) => {
    try {
      setIsLoading(true);
      // TODO: Replace with actual API call
      const plan: Plan = {
        ...data.planData,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setPlans([...plans, plan]);
      setIsAddDialogOpen(false);
      toast({
        title: t('common.success'),
        description: t('plans.addSuccess'),
      });
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('plans.addError'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async (data: PlanRequest) => {
    if (!selectedPlan) return;
    try {
      setIsLoading(true);
      // TODO: Replace with actual API call
      const updatedPlans = plans.map((p) =>
        p.id === selectedPlan.id ? { ...data.planData, id: selectedPlan.id, createdAt: selectedPlan.createdAt, updatedAt: new Date().toISOString() } : p
      );
      setPlans(updatedPlans);
      setIsEditDialogOpen(false);
      setSelectedPlan(null);
      toast({
        title: t('common.success'),
        description: t('plans.editSuccess'),
      });
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('plans.editError'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedPlan) return;
    try {
      setIsLoading(true);
      // TODO: Replace with actual API call
      const updatedPlans = plans.filter((p) => p.id !== selectedPlan.id);
      setPlans(updatedPlans);
      setIsDeleteDialogOpen(false);
      setSelectedPlan(null);
      toast({
        title: t('common.success'),
        description: t('plans.deleteSuccess'),
      });
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('plans.deleteError'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedPlan(null);
    setIsAddDialogOpen(true);
  };

  return (
    <div className={cn("space-y-4", isRTL ? "rtl" : "ltr")}>
      <div className={cn(
        "flex items-center justify-between border-b pb-4",
        isRTL ? "flex-row-reverse" : "flex-row"
      )}>
        <div>
          <h1 className="text-3xl font-bold text-[#1A5F5E]">{t('plans.title')}</h1>
          <p className="text-sm text-muted-foreground">{t('plans.description')}</p>
        </div>
        <Button
          onClick={handleAdd}
          className="bg-[#1A5F5E] hover:bg-[#1A5F5E]/90"
        >
          <Plus className={cn(
            "h-4 w-4 mr-2",
            isRTL ? "ml-2" : "mr-2"
          )} />
          {t('plans.add')}
        </Button>
      </div>

      <Card className="p-6">
        <DataTable
          columns={columns}
          data={plans}
          searchable
          title={t('plans.title')}
          onEdit={(plan) => {
            setSelectedPlan(plan);
            setIsEditDialogOpen(true);
          }}
          onDelete={(plan) => {
            setSelectedPlan(plan);
            setIsDeleteDialogOpen(true);
          }}
        />
      </Card>

      <PlanDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={handleAddPlan}
      />

      <PlanDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSubmit={handleEdit}
        plan={selectedPlan}
      />

      <DeleteDialog
        title={t('plans.delete')}
        description={t('plans.deleteConfirmation')}
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {
          setIsDeleteDialogOpen(open);
          if (!open) {
            setSelectedPlan(null);
          }
        }}
        onConfirm={handleDelete}
        isLoading={isLoading}
      />
    </div>
  );
};

export default PlansPage; 