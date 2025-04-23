import React, { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Feature } from '@/types/feature';
import { Column } from '@/types/data-table';
import { DeleteDialog } from '@/components/dialogs/delete-dialog';
import { FeatureDialog } from '@/components/dialogs/feature-dialog';
import { useToast } from '@/hooks/use-toast';

// Mock data - replace with actual API calls
const initialFeatures: Feature[] = [
  {
    id: "1",
    name: "Attendance Tracking",
    enable: true,
    buildIn: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Payment Management",
    enable: true,
    buildIn: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const FeaturesPage = () => {
  const { toast } = useToast();
  const [features, setFeatures] = useState<Feature[]>(initialFeatures);
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);
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

  const columns: Column<Feature>[] = [
    {
      key: 'name' as keyof Feature,
      title: t('table.headers.features.name'),
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
      key: 'enable' as keyof Feature,
      title: t('table.headers.features.enable'),
      render: (value: boolean) => (
        <Badge className={value ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
          {value ? t('common.enabled') : t('common.disabled')}
        </Badge>
      ),
    },
    {
      key: 'buildIn' as keyof Feature,
      title: t('table.headers.features.buildIn'),
      render: (value: boolean) => (
        <Badge className={value ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}>
          {value ? t('common.yes') : t('common.no')}
        </Badge>
      ),
    },
    {
      key: 'created_at' as keyof Feature,
      title: t('table.headers.features.createdAt'),
      render: (value: string) => (
        <div className={cn(
          "text-gray-600",
          isRTL ? "text-right" : "text-left"
        )}>
          {new Date(value).toLocaleDateString()}
        </div>
      ),
    },
  ];

  const handleAddFeature = async (newFeature: Omit<Feature, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setIsLoading(true);
      // TODO: Replace with actual API call
      const feature: Feature = {
        ...newFeature,
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setFeatures([...features, feature]);
      setIsAddDialogOpen(false);
      toast({
        title: t('common.success'),
        description: t('features.addSuccess'),
      });
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('features.addError'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async (data: Omit<Feature, 'id' | 'created_at' | 'updated_at'>) => {
    if (!selectedFeature) return;
    try {
      setIsLoading(true);
      // TODO: Replace with actual API call
      const updatedFeatures = features.map((f) =>
        f.id === selectedFeature.id ? { ...data, id: selectedFeature.id, created_at: selectedFeature.created_at, updated_at: new Date().toISOString() } : f
      );
      setFeatures(updatedFeatures);
      setIsEditDialogOpen(false);
      setSelectedFeature(null);
      toast({
        title: t('common.success'),
        description: t('features.editSuccess'),
      });
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('features.editError'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedFeature) return;
    try {
      setIsLoading(true);
      // TODO: Replace with actual API call
      const updatedFeatures = features.filter((f) => f.id !== selectedFeature.id);
      setFeatures(updatedFeatures);
      setIsDeleteDialogOpen(false);
      setSelectedFeature(null);
      toast({
        title: t('common.success'),
        description: t('features.deleteSuccess'),
      });
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('features.deleteError'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("space-y-4", isRTL ? "rtl" : "ltr")}>
      <div className={cn(
        "flex items-center justify-between border-b pb-4",
        isRTL ? "flex-row-reverse" : "flex-row"
      )}>
        <div>
          <h1 className="text-3xl font-bold text-[#1A5F5E]">{t('features.title')}</h1>
          <p className="text-sm text-muted-foreground">{t('features.description')}</p>
        </div>
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-[#1A5F5E] hover:bg-[#1A5F5E]/90"
        >
          <Plus className={cn(
            "h-4 w-4 mr-2",
            isRTL ? "ml-2" : "mr-2"
          )} />
          {t('features.add')}
        </Button>
      </div>

      <Card className="p-6">
        <DataTable
          columns={columns}
          data={features}
          searchable
          pagination
          pageSize={10}
          onEdit={(feature) => {
            setSelectedFeature(feature);
            setIsEditDialogOpen(true);
          }}
          onDelete={(feature) => {
            setSelectedFeature(feature);
            setIsDeleteDialogOpen(true);
          }}
        />
      </Card>

      <FeatureDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={handleAddFeature}
        isLoading={isLoading}
      />

      <FeatureDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSubmit={handleEdit}
        defaultValues={selectedFeature}
        isLoading={isLoading}
      />

      <DeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
        isLoading={isLoading}
        title={t('features.deleteTitle')}
        description={t('features.deleteDescription')}
      />
    </div>
  );
};

export default FeaturesPage; 