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
import { Child, createChild, CreateChildRequest, deleteChild, getAllChildren } from '@/api/Kindergarten/Children/childrenApis';

const mockGroups: Group[] = [
  {
    id: '1',
    name: 'Group 1',
    description: 'Description 1',
    capacity: 20,
    staffName: 'Test Name',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    children: [],
  },
];

const ChildrenPage: React.FC = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { isRTL } = useRTL();
  const Kg_id = localStorage.getItem("selectedKG");


  const columns: Column<Child>[] = [
    {
      key: "first_name",
      title: t('table.headers.children.firstName'),
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
      key: "last_name",
      title: t('table.headers.children.lastName'),
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
      key: "gender",
      title: t('table.headers.children.gender'),
      render: (value: string) => (
        <Badge className={value === 'male' ? "bg-blue-100 text-blue-800" : "bg-pink-100 text-pink-800"}>
          {t(`common.gender.${value}`)}
        </Badge>
      ),
    },
    {
      key: "mother_idno",
      title: t('table.headers.children.parentId'),
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
      key: "groupId",
      title: t('table.headers.children.groupId'),
      render: (value: string | undefined) => (
        <Badge className={value ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
          {value ? t('common.hasGroup') : t('common.noGroup')}
        </Badge>
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

  // const handleEdit = async (data: Omit<Child, 'id' | 'createdAt' | 'updatedAt'>) => {
  //   if (!selectedChildren.length) return;

  //   try {
  //     const updatedChildren = await Promise.all(
  //       selectedChildren.map((child) => childrenService.updateChild(child.id, {
  //         firstName: data.firstName,
  //         lastName: data.lastName,
  //         dateOfBirth: data.dateOfBirth,
  //         gender: data.gender,
  //         parentId: data.parentId,
  //         groupId: data.groupId,
  //       }))
  //     );
  //     setChildren((prev) =>
  //       prev.map((child) =>
  //         updatedChildren.find((updated) => updated.id === child.id) || child
  //       )
  //     );
  //     setIsEditDialogOpen(false);
  //     setSelectedChildren([]);
  //     toast({
  //       title: t('common.success'),
  //       description: t('children.editSuccess'),
  //     });
  //   } catch (error) {
  //     toast({
  //       variant: 'destructive',
  //       title: t('common.error'),
  //       description: t('children.editError'),
  //     });
  //   }
  // };

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
          // onEdit={(child) => {
          //   setSelectedChildren([child]);
          //   setIsEditDialogOpen(true);
          // }}
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

    {/* 
      <ChildDialog
        child={selectedChildren[0]}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSubmit={handleEdit}
      />
     */}
    </div>
  );
};

export default ChildrenPage;
