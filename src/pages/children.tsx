import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { DataTable } from '@/components/ui/data-table';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { ChildDialog } from '@/components/dialogs/child-dialog';
import { DeleteDialog } from '@/components/dialogs/delete-dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Group } from '@/types/group';
import { Column } from '@/types/data-table';
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { useRTL } from "@/hooks/use-rtl";
import { PageHeader } from '@/components/ui/page-header';
import { Child, createChild, CreateChildRequest, deleteChild, getAllChildren, updateChild } from '@/api/Kindergarten/Children/childrenApis';

const ChildrenPage: React.FC = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { isRTL } = useRTL();
  const Kg_id = localStorage.getItem("selectedKG");


  const columns: Column<Child>[] = [
    {
  key: "full_name",
  title: t("table.headers.children.fullName"),
  render: (_: any, row: any) => (
    <div
      className={cn(
        "font-medium text-[#1A5F5E]",
        isRTL ? "text-right" : "text-left"
      )}
    >
      {[
        row.first_name,
        row.second_name,
        row.third_name,
        row.last_name,
      ]
        .filter(Boolean)
        .join(" ")}
    </div>
  ),
},
    {
      key: "birth_date",
      title: t('table.headers.children.dateOfBirth'),
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
      key: "father_idno",
      title: t('table.headers.children.fatherIdNumber'),
      render: (_: any, row: Child) => (
      <div className={cn(
      "text-gray-600",
      isRTL ? "text-right" : "text-left"
      )}>
      {row.fatheruser?.id_no}
      </div>
  ),
    },
    {
      key: "mother_idno",
      title: t('table.headers.children.motherIdNumber'),
     render: (_: any, row: Child) => (
     <div className={cn(
      "text-gray-600",
      isRTL ? "text-right" : "text-left"
      )}>
      {row.motheruser?.id_no}
    </div>
     ),
    },
  ];

  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChildren, setSelectedChildren] = useState<Child | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    loadChildren();
  }, []);

  const loadChildren = async () => {
    try {
      const data = await getAllChildren(Kg_id);
      setChildren(data);
      console.log("ch",data)
    } catch (error) {
      toast({
        variant: 'destructive',
        title: t('common.error'),
        description: t('children.loadError'),
      });
    }
  };

  const handleAdd = async (data: CreateChildRequest) => {
    console.log(data);

    try {
      const { data: responseData } = await createChild( Kg_id, data);
      const newChild: Child = { ...responseData };

      console.log(newChild);

      setChildren(prev => [...prev, newChild]);
      setIsAddDialogOpen(false);
      toast({
        title: t('common.success'),
        description: t('children.addSuccess'),
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: t('common.error'),
        description: t('children.addError'),
      });
    }
  };

  const handleEdit = async (data: CreateChildRequest) => {
      if (!selectedChildren) return;
    
      try {
    
         const response = await updateChild(Kg_id,selectedChildren.id, {
      ...data,
      kg: Kg_id,
    });
        const updatedChild: Child = response.data;
  
        setChildren(prev =>
          prev.map(k => (k.id === updatedChild.id ? updatedChild : k))
        );
  
       setTimeout(() => window.location.reload(), 1000);
        setIsEditDialogOpen(false);
        setSelectedChildren(null);
       toast({
        title: t('common.success'),
        description: t('children.editSuccess'),
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: t('common.error'),
        description: t('children.editError'),
      });
    };
  }

  const handleDelete = async () => {
    if (!selectedChildren) return;

    console.log("selected",selectedChildren.id);

    try {
      await deleteChild(Kg_id,selectedChildren.id);
      const updatedChildren = children.filter(
        (k) => k.id !== selectedChildren.id
      );

      setChildren(updatedChildren);
      setIsDeleteDialogOpen(false);
      setSelectedChildren(null);
      toast({
        title: t('common.success'),
        description: t('children.deleteSuccess'),
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: t('common.error'),
        description: t('children.deleteError'),
      });
    }
  };

  return (
    <div className={cn("w-full px-6 py-6", isRTL ? "rtl" : "ltr")}>
      <PageHeader
        title={t('children.title')}
        description={t('children.description')}
        isRTL={isRTL}
      >
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-[#1A5F5E] hover:bg-[#1A5F5E]/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          {t('children.add')}
        </Button>
      </PageHeader>

      <Card className="w-full p-6 shadow-sm overflow-hidden mt-6">
        <DataTable
          columns={columns}
          data={children}
          onEdit={(selectedChildren) => {
            setSelectedChildren(selectedChildren);
            setIsEditDialogOpen(true);
          }}
          onDelete={(selectedChildren) => {
            setSelectedChildren(selectedChildren);
            setIsDeleteDialogOpen(true);
          }}
        />
      </Card>

       <ChildDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={handleAdd}
      />

      <DeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
        title={t('children.delete')}
        description={t('children.deleteConfirmation')}
      />

      <ChildDialog
        child={selectedChildren}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSubmit={handleEdit}
      />
    </div>
  );
};

export default ChildrenPage;
