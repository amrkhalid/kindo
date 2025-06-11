import React, { useState, useEffect } from "react";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Feature } from '@/types/feature';
import { Column } from '@/types/data-table';
//import { DeleteDialog } from '@/components/dialogs/delete-dialog';
import { FeatureDialog } from '@/components/dialogs/feature-dialog';
import { useToast } from '@/hooks/use-toast';
import { getFeatures, updateFeature, addFeature } from "@/api/Subscribtion/Features/FeatureApis";

const FeaturesPage = () => {
  const { toast } = useToast();
  const [features, setFeatures] = useState<Feature[]>([]);
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  //const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { t, i18n } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const languages = [
    { code: 'en', label: 'English', dir: 'ltr' },
    { code: 'ar', label: 'العربية', dir: 'rtl' },
    { code: 'he', label: 'עברית', dir: 'rtl' }
  ];

  const isRTL = languages.find(lang => lang.code === i18n.language)?.dir === 'rtl';

  const columns: Column<Feature>[] = [
    {
      key: 'name',
      title: t('table.headers.features.name'),
      render: (value: string) => (
        <div className={cn("font-medium text-[#1A5F5E]", isRTL ? "text-right" : "text-left")}>
          {value}
        </div>
      ),
    },
    {
      key: 'enable',
      title: t('table.headers.features.enable'),
      render: (value: boolean) => (
        <Badge className={value ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
          {value ? t('common.enabled') : t('disabled')}
        </Badge>
      ),
    },
    {
      key: 'buildIn',
      title: t('table.headers.features.buildIn'),
      render: (value: boolean) => (
        <Badge className={value ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}>
          {value ? t('common.yes') : t('common.no')}
        </Badge>
      ),
    },
    {
      key: 'created_at',
      title: t('table.headers.features.createdAt'),
      render: (value: string) => (
        <div className={cn("text-gray-600", isRTL ? "text-right" : "text-left")}>
          {new Date(value).toLocaleDateString()}
        </div>
      ),
    },
  ];

  useEffect(() => {
    const fetchFeatures = async () => {
      setIsLoading(true);
      try {
        const response = await getFeatures(currentPage, 10);
        setFeatures(response.data.data);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        toast({
          title: t('common.error'),
          description: t('features.fetchError'),
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchFeatures();
  }, [t, toast, currentPage]);

  const handleAddFeature = async (newFeature: Omit<Feature, '_id' | 'created_at' | 'updated_at'>) => {
    try {
      setIsLoading(true);
      const response = await addFeature(newFeature);
      setFeatures([...features, response.data]);
      setIsAddDialogOpen(false);
      toast({
        title: t('common.success'),
        description: t('features.addSuccess'),
      });
    } catch (error) {
      console.error("Add feature error:", error);
      toast({
        title: t('common.error'),
        description: t('features.addError'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

const handleEdit = async (feature: Feature) => {
  if (!feature._id) {
    console.error("Feature ID is missing");
    toast({
      title: "خطأ",
      description: "لا يمكن تعديل الخاصية بدون ID",
      variant: "destructive",
    });
    return;
  }

  try {
    const response = await updateFeature(feature._id, feature.enable);
    
    console.log("Feature updated:", response.data);
    const updatedFeatures = features.map((f) =>
      f._id === feature._id ? response.data : f
    );
    setFeatures(updatedFeatures);

    toast({
      title: "تم التحديث",
      description: "تم تحديث حالة الخاصية بنجاح",
    });
  } catch (error) {
    console.error("Error updating feature:", error);
    toast({
      title: "خطأ",
      description: "فشل في تحديث الخاصية",
      variant: "destructive",
    });
  }
};


  return (
    <div className={cn("space-y-4", isRTL ? "rtl" : "ltr")}>
      <div className={cn("flex items-center justify-between border-b pb-4", isRTL ? "flex-row-reverse" : "flex-row")}>
        <div>
          <h1 className="text-3xl font-bold text-[#1A5F5E]">{t('features.title')}</h1>
          <p className="text-sm text-muted-foreground">{t('features.description')}</p>
        </div>
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-[#1A5F5E] hover:bg-[#1A5F5E]/90"
          disabled={isLoading}
        >
          <Plus className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
          {t('features.add')}
        </Button>
      </div>

      <Card className="p-6">
        <DataTable
          columns={columns}
          data={features}
          searchable
          loading={isLoading}
          onEdit={(feature) => {
            setSelectedFeature(feature);
            setIsEditDialogOpen(true);
          }}
        />

        <div className="flex justify-center mt-4 gap-2">
          <Button
            disabled={currentPage === 1 || isLoading}
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          >
            {t('common.previous')}
          </Button>
          <span className="flex items-center px-2">
            {t('common.page')} {currentPage} / {totalPages}
          </span>
          <Button
            disabled={currentPage === totalPages || isLoading}
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          >
            {t('common.next')}
          </Button>
        </div>
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
        defaultValues={selectedFeature || undefined}
        isLoading={isLoading}
      />

      {/*<DeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
        isLoading={isLoading}
        title={t('features.deleteTitle')}
        description={t('features.deleteDescription')}
      />*/}
    </div>
  );
};

export default FeaturesPage;


/*<Card className="p-6">
        <DataTable
          columns={columns}
          data={features}
          searchable
          loading={isLoading}
          onEdit={(feature) => {
            setSelectedFeature(feature);
            setIsEditDialogOpen(true);
          }}
          onDelete={(feature) => {
            setSelectedFeature(feature);
            setIsDeleteDialogOpen(true);
          }}
        />*/