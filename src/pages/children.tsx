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
import { AssignChildrenDialog } from '@/components/dialogs/assign-children-dialog';
import { Group } from '@/types/group';
import { Column } from '@/types/data-table';
import { Badge } from "@/components/ui/badge";
import { childrenService } from '@/services/children.service';
import { Child } from '@/types/child';
import { format } from 'date-fns';
import { useRTL } from "@/hooks/use-rtl";
import { PageHeader } from '@/components/ui/page-header';

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

  const columns: Column<Child>[] = [
    {
      key: "firstName",
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
      key: "lastName",
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
      key: "dateOfBirth",
      title: t('table.headers.children.dateOfBirth'),
      render: (value: string) => (
        <div className={cn(
          "text-gray-600",
          isRTL ? "text-right" : "text-left"
        )}>
          {format(new Date(value), "PPP")}
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
      key: "parentId",
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
  const [selectedChildren, setSelectedChildren] = useState<Child[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);

  useEffect(() => {
    loadChildren();
  }, []);

  const loadChildren = async () => {
    try {
      const data = await childrenService.getAllChildren();
      setChildren(data);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: t('common.error'),
        description: t('children.loadError'),
      });
    }
  };

  const handleAdd = async (data: Omit<Child, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newChild = await childrenService.createChild({
        firstName: data.firstName,
        lastName: data.lastName,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        parentId: data.parentId,
        groupId: data.groupId,
      });
      setChildren((prev) => [...prev, newChild]);
      setIsAddDialogOpen(false);
      toast({
        title: t('common.success'),
        description: t('children.addSuccess'),
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: t('common.error'),
        description: t('children.addError'),
      });
    }
  };

  const handleEdit = async (data: Omit<Child, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!selectedChildren.length) return;

    try {
      const updatedChildren = await Promise.all(
        selectedChildren.map((child) => childrenService.updateChild(child.id, {
          firstName: data.firstName,
          lastName: data.lastName,
          dateOfBirth: data.dateOfBirth,
          gender: data.gender,
          parentId: data.parentId,
          groupId: data.groupId,
        }))
      );
      setChildren((prev) =>
        prev.map((child) =>
          updatedChildren.find((updated) => updated.id === child.id) || child
        )
      );
      setIsEditDialogOpen(false);
      setSelectedChildren([]);
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
    }
  };

  const handleDelete = async () => {
    if (!selectedChildren.length) return;

    try {
      await Promise.all(
        selectedChildren.map((child) => childrenService.deleteChild(child.id))
      );
      setChildren((prev) =>
        prev.filter((child) => !selectedChildren.some((selected) => selected.id === child.id))
      );
      setIsDeleteDialogOpen(false);
      setSelectedChildren([]);
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

  const handleAssign = async (group: Group) => {
    try {
      const updatedChildren = await Promise.all(
        selectedChildren.map((child) => childrenService.updateChild(child.id, {
          groupId: group.id,
        }))
      );
      setChildren((prev) =>
        prev.map((child) =>
          updatedChildren.find((updated) => updated.id === child.id) || child
        )
      );
      setIsAssignDialogOpen(false);
      setSelectedChildren([]);
      toast({
        title: t('common.success'),
        description: t('children.assignSuccess'),
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: t('common.error'),
        description: t('children.assignError'),
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
        <DataTable<Child>
          columns={columns}
          data={children}
          onEdit={(child) => {
            setSelectedChildren([child]);
            setIsEditDialogOpen(true);
          }}
          onDelete={(child) => {
            setSelectedChildren([child]);
            setIsDeleteDialogOpen(true);
          }}
          onAssign={(child) => {
            setSelectedChildren([child]);
            setIsAssignDialogOpen(true);
          }}
        />
      </Card>

      <ChildDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={handleAdd}
      />

      <ChildDialog
        child={selectedChildren[0]}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSubmit={handleEdit}
      />

      <DeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
        title={t('children.delete')}
        description={t('children.deleteConfirmation', { count: selectedChildren.length })}
      />

      <AssignChildrenDialog
        open={isAssignDialogOpen}
        onOpenChange={setIsAssignDialogOpen}
        onSubmit={handleAssign}
        groups={mockGroups}
        children={selectedChildren}
      />
    </div>
  );
};

export default ChildrenPage;
