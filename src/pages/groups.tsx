import React, { useEffect, useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { GroupDialog } from '@/components/dialogs/group-dialog';
import { DeleteDialog } from '@/components/dialogs/delete-dialog';
import type { Column } from '@/types/data-table';
import { createGroup, CreateGroupRequest, deleteGroup, getAllGroups, Group, updateGroup } from "@/api/Kindergarten/Group/groupApis";

export default function GroupsPage() {
  const { toast } = useToast();
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { t, i18n } = useTranslation();
  const Kg_id = localStorage.getItem("selectedKG");

  // List of available languages with their directions
  const languages = [
    { code: 'en', label: 'English', dir: 'ltr' },
    { code: 'ar', label: 'العربية', dir: 'rtl' },
    { code: 'he', label: 'עברית', dir: 'rtl' }
  ];

  const isRTL = languages.find(lang => lang.code === i18n.language)?.dir === 'rtl';

    useEffect(() => {
      loadGroups();
    }, []);

    const loadGroups = async () => {
      try {
          const response = await getAllGroups(Kg_id);
          setGroups(response);
        } catch (error) {
          console.error("Failed to fetch my groups", error);
        }
      }
    

  const columns: Column<Group>[] = [
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


  const handleAdd = async (data: CreateGroupRequest) => {
    try {
      setIsLoading(true);
      const { data: responseData } = await createGroup( Kg_id, data);
      const newGroup: Group = { ...responseData };

      console.log(newGroup);

      setGroups(prev => [...prev, newGroup]);
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

  const handleEdit = (group: Group) => {
    setSelectedGroup(group);
    setIsEditDialogOpen(true);
  };

  const handleEditSubmit = async (data: CreateGroupRequest) => {
    if (!selectedGroup) return;

    try {
      setIsLoading(true);
      const response = await updateGroup(Kg_id, data ,selectedGroup.id);
      const updatedGroup: Group = response.data;

      setGroups(prev =>
        prev.map(g => (g.id === updatedGroup.id ? updatedGroup : g))
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
      await deleteGroup(Kg_id,selectedGroup.id);
      const updatedGroups = groups.filter(
        (g) => g.id !== selectedGroup.id
      );

      setGroups(updatedGroups);
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
