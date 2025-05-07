import React, { useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { GroupDialog } from '@/components/dialogs/group-dialog';
import { DeleteDialog } from '@/components/dialogs/delete-dialog';
import type { Child } from '@/types/child';
import type { Column } from '@/types/data-table';

export interface GroupData {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

// Mock data for initial groups
const initialGroups: GroupData[] = [
  {
    id: "1",
    name: "Group A",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Group B",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default function GroupsPage() {
  const { toast } = useToast();
  const [groups, setGroups] = useState<GroupData[]>(initialGroups);
  const [selectedGroup, setSelectedGroup] = useState<GroupData | null>(null);
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

  const columns: Column<GroupData>[] = [
    {
      key: 'name',
      title: t('table.headers.groups.name'),
      render: (value: string) => (
        <div className={cn(
          "font-medium text-[#1A5F5E]",
          isRTL ? "text-right" : "text-left"
        )}>
          {value}
        </div>
      ),
    },
  ];

  const handleAdd = async (data: Omit<GroupData, "id" | "createdAt" | "updatedAt">) => {
    try {
      setIsLoading(true);
      // TODO: Replace with actual API call
      const newGroup: GroupData = {
        ...data,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setGroups((prev) => [...prev, newGroup]);
      setIsAddDialogOpen(false);
      toast({
        title: t('common.success'),
        description: t('groups.addSuccess'),
        variant: 'default',
      });
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('groups.addError'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (group: GroupData) => {
    setSelectedGroup(group);
    setIsEditDialogOpen(true);
  };

  const handleEditSubmit = async (data: Omit<GroupData, "id" | "createdAt" | "updatedAt">) => {
    if (!selectedGroup) return;

    try {
      setIsLoading(true);
      // TODO: Replace with actual API call
      const updatedGroup: GroupData = {
        ...selectedGroup,
        ...data,
        updatedAt: new Date().toISOString(),
      };
      setGroups((prev) =>
        prev.map((group) =>
          group.id === selectedGroup.id ? updatedGroup : group
        )
      );
      setIsEditDialogOpen(false);
      setSelectedGroup(null);
      toast({
        title: t('common.success'),
        description: t('groups.editSuccess'),
        variant: 'default',
      });
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('groups.editError'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedGroup) return;

    try {
      setIsLoading(true);
      // TODO: Replace with actual API call
      setGroups((prev) =>
        prev.filter((group) => group.id !== selectedGroup.id)
      );
      setIsDeleteDialogOpen(false);
      setSelectedGroup(null);
      toast({
        title: t('common.success'),
        description: t('groups.deleteSuccess'),
        variant: 'default',
      });
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('groups.deleteError'),
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
          <h1 className="text-3xl font-bold text-[#1A5F5E]">{t('groups.title')}</h1>
          <p className="text-sm text-muted-foreground">{t('groups.description')}</p>
        </div>
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-[#1A5F5E] hover:bg-[#1A5F5E]/90"
        >
          <Plus className={cn(
            "h-4 w-4",
            isRTL ? "ml-2" : "mr-2"
          )} />
          {t('groups.add')}
        </Button>
      </div>

      <Card className="p-6">
        <DataTable
          columns={columns}
          data={groups}
          searchable
          pagination
          pageSize={10}
          onEdit={handleEdit}
          onDelete={(group) => {
            setSelectedGroup(group);
            setIsDeleteDialogOpen(true);
          }}
        />
      </Card>

      <GroupDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={handleAdd}
        isLoading={isLoading}
      />

      <GroupDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSubmit={handleEditSubmit}
        defaultValues={selectedGroup}
        isLoading={isLoading}
      />

      <DeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
        isLoading={isLoading}
        title={t('groups.deleteTitle')}
        description={t('groups.deleteDescription')}
      />
    </div>
  );
}
