import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { DataTable } from "@/components/ui/data-table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { getMyKG } from "@/api/Profile/myKG";
import { useToast } from "@/hooks/use-toast";
import { KindergartenDialog } from '@/components/dialogs/kindergarten-dialog';
import { DeleteDialog } from '@/components/dialogs/delete-dialog';
import { Column } from '@/types/data-table';
import { toast } from 'sonner';
import { createKindergarten, CreateKindergartenRequest, deleteKindergarten, Kindergarten, Plan, updateKindergarten } from "@/api/Kindergarten/Kindergartens/kindergartenApis";


const KindergartensPage = () => {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const [kindergartens, setKindergartens] = useState<Kindergarten[]>([]);
  const [selectedKindergarten, setSelectedKindergarten] = useState<Kindergarten | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // List of available languages with their directions
  const languages = [
    { code: 'en', label: 'English', dir: 'ltr' },
    { code: 'ar', label: 'العربية', dir: 'rtl' },
    { code: 'he', label: 'עברית', dir: 'rtl' }
  ];

  // Mock plans data - replace with actual API call
const mockPlans: Plan[] = [
  {
    _id: "67f954f665d12a811dcc15ca",
    name: "Basic Plan",
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    cost: 99.99,
    discount: 0,
    enable: true,
    buildIn: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    __v:0
  },
  {
    _id: "67f954f665d12a811dcc15ca",
    name: "Premium Plan",
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    cost: 199.99,
    discount: 10,
    enable: true,
    buildIn: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    __v:0
  },
  ];

  const isRTL = languages.find(lang => lang.code === i18n.language)?.dir === 'rtl';

  const columns: Column<Kindergarten>[] = [
    {
      key: 'name',
      title: t('table.headers.kindergartens.name'),
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
      key: 'address',
      title: t('table.headers.kindergartens.address'),
      render: (value: string) => (
        <div className={cn(
          "text-gray-600",
          isRTL ? "text-right" : "text-left"
        )}>
          {value}
        </div>
      ),
    },
    {
      key: 'phone_number',
      title: t('table.headers.kindergartens.phoneNumber'),
      render: (value: string) => (
        <div className={cn(
          "text-gray-600",
          isRTL ? "text-right" : "text-left"
        )}>
          {value}
        </div>
      ),
    },
    {
      key: 'is_active',
      title: t('table.headers.kindergartens.isActive'),
      render: (value: boolean) => (
        <Badge className={value ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
          {value ? t('common.active') : t('common.inactive')}
        </Badge>
      ),
    },
    {
      key: 'created_at',
      title: t('table.headers.kindergartens.joinDate'),
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

  useEffect(() => {
    async function fetchMyKG() {
      try {
        const response = await getMyKG();
        setKindergartens(response);
      } catch (error) {
        console.error("Failed to fetch my KG", error);
      }
    }
    fetchMyKG();
  }, []);
  
  
  const handleAddKindergarten = async (data: CreateKindergartenRequest) => {
    setIsLoading(true);
    try {
      const { data: responseData } = await createKindergarten(data);
      const newKG: Kindergarten = { ...responseData, __v: 0 };
  
      setKindergartens(prev => [...prev, newKG]);
      setIsAddDialogOpen(false);
      toast({
        title: t('common.success'),
        description: t('kindergartens.addSuccess'),
        variant: "success"
      });
    } catch (error) {
      console.error(error);
      toast({
        title: t('common.error'),
        description: t('kindergartens.addError'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async (data: CreateKindergartenRequest) => {
    if (!selectedKindergarten) return;
  
    try {
      setIsLoading(true);
  
      const response = await updateKindergarten(selectedKindergarten._id, data);
      const updatedKG: Kindergarten = response.data.result;
      console.log(response.data.result);

      setKindergartens(prev =>
        prev.map(k => (k._id === updatedKG._id ? updatedKG : k))
      );

      setTimeout(() => window.location.reload(), 1000);
      setIsEditDialogOpen(false);
      setSelectedKindergarten(null);
  
      toast({
        title: t('common.success'),
        description: t('kindergartens.editSuccess'),
        variant: "success"
      });
    } catch (error) {
      console.error("Edit failed", error);
      toast({
        title: t('common.error'),
        description: t('kindergartens.editError'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedKindergarten) return;
  
    try {
      setIsLoading(true);
  
      await deleteKindergarten(selectedKindergarten._id);
  
      const updatedKindergartens = kindergartens.filter(
        (k) => k._id !== selectedKindergarten._id
      );
      setKindergartens(updatedKindergartens);
  
      window.location.reload();
      setIsDeleteDialogOpen(false);
      setSelectedKindergarten(null);
  
      toast({
        title: t('common.success'),
        description: t('kindergartens.deleteSuccess'),
        variant: "success"
      });
    } catch (error) {
      console.error("Delete failed", error);
      toast({
        title: t('common.error'),
        description: t('kindergartens.deleteError'),
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
          <h1 className="text-3xl font-bold text-[#1A5F5E]">{t('navigation.kindergartens')}</h1>
          <p className="text-sm text-muted-foreground">{t('kindergartens.description')}</p>
        </div>
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-[#1A5F5E] hover:bg-[#1A5F5E]/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          {t('kindergartens.add')}
        </Button>
      </div>

      <Card className="p-6">
      <DataTable 
          columns={columns}
          data={kindergartens}
          searchable
          title={t('kindergartens.title')}
          onEdit={(kindergarten) => {
            setSelectedKindergarten(kindergarten);
            setIsEditDialogOpen(true);
          }}
          onDelete={(kindergarten) => {
            setSelectedKindergarten(kindergarten);
            setIsDeleteDialogOpen(true);
          }}
        />
      </Card>
      
      <KindergartenDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={handleAddKindergarten}
        isLoading={isLoading}
        plans={mockPlans}
      />

      <KindergartenDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSubmit={handleEdit}
        defaultValues={selectedKindergarten}
        isLoading={isLoading}
        plans={mockPlans}
      />

      <DeleteDialog
        title={t('kindergartens.delete')}
        description={t('kindergartens.deleteConfirmation')}
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {
          setIsDeleteDialogOpen(open);
          if (!open) {
            setSelectedKindergarten(null);
          }
        }}
        onConfirm={handleDelete}
        isLoading={isLoading}
      />
    </div>
  );
};

export default KindergartensPage;
