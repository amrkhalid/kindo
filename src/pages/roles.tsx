import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { DataTable } from '@/components/ui/data-table';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Column } from '@/types/data-table';
import { useToast } from '@/hooks/use-toast';
import { AddRoleDialog } from '@/components/dialogs/add-role-dialog';
import { EditRoleDialog } from '@/components/dialogs/edit-role-dialog';
import { DeleteDialog } from '@/components/dialogs/delete-dialog';
import { PageHeader } from '@/components/ui/page-header';
import { createRole, deleteRole, getAllRoles, updateRole } from '@/api/Kindergarten/Kg_roles/rolesApis';

interface RoleRow {
  id: string;
  username: string;
  email: string;
  role: string;
  joinDate: string;
}

const RolesPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RoleRow | null>(null);
  const [roles, setRoles] = useState<RoleRow[]>([]);
  const Kg_id = localStorage.getItem("selectedKG");
  const isRTL = i18n.dir() === 'rtl';

  useEffect(() => {
    async function fetchKGRoles() {
      try {
        const response = await getAllRoles(Kg_id);
        console.log("Fetched Roles Response:", response);
  
        const mappedRoles = response.map((r) => ({
          id: r.id,
          username: r.user?.username ?? "—",
          email: r.user?.email ?? "—",
          role: r.role,
          joinDate: r.created_at,
        }));
  
        setRoles(mappedRoles);
      } catch (error) {
        console.error("Failed to fetch Kg roles", error);
      }
    }
    fetchKGRoles();
  }, [Kg_id]);

  const handleAddRole = async ({ identity, role }: { identity: string; role: string }) => {
    try {
      const response = await createRole(Kg_id, {
        idno: identity,
        role,
      });
      setTimeout(() => window.location.reload(), 1000);
 
      toast({
        title: t("roles.addSuccess"),
        description: `${identity ?? "—"} ${t('roles.addDescription')}`,
      });
  
      setIsAddDialogOpen(false);
    } catch (error) {
      toast({
        title: t("common.error"),
        description: t("roles.addError"),
        variant: "destructive",
      });
      console.error("Error adding role:", error);
    }
  };

  const handleEditRole = async ({ role ,}: { role: string }) => {
    if (!selectedRole) return;
    try {
      const response = await updateRole(Kg_id, {
        role,
      },selectedRole.id);

      setTimeout(() => window.location.reload(), 1000);
      toast({
        title: t('roles.editSuccess'),
        description: t('roles.editSuccess'),
      });
      setIsEditDialogOpen(false);
      setSelectedRole(null);
      } catch (error) {
      toast({
        title: t("common.error"),
        description: t("roles.editError"),
        variant: "destructive",
      });
      console.error("Error editing role:", error);
    }
  };

  const handleDeleteRole = async () => {
    if (!selectedRole) return;
    console.log(selectedRole);
  
      try {
        await deleteRole(Kg_id,selectedRole.id);
        const updatedRoles = roles.filter(
          (r) => r.id !== selectedRole.id
        );
  
        setRoles(updatedRoles);
        setIsDeleteDialogOpen(false);
        setSelectedRole(null);
        toast({
          title: t('common.success'),
          description: t('roles.deleteSuccess'),
          variant: 'default',
        });
      } catch (error) {
        toast({
          title: t('common.error'),
          description: t('roles.deleteError'),
          variant: 'destructive',
        });

  };}

  const columns: Column<RoleRow>[] = [
    {
      key: 'username',
      title: t('table.headers.roles.username'),
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
      key: 'email',
      title: t('table.headers.roles.email'),
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
      key: 'role',
      title: t('table.headers.roles.role'),
      render: (value: string) => (
        <Badge className={cn(
          value === "manager" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800",
          isRTL ? "ml-2" : "mr-2"
        )}>
          {value}
        </Badge>
      ),
    },
    {
      key: 'joinDate',
      title: t('table.headers.roles.joinDate'),
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

  return (
    <div className={cn(
      "space-y-4",
      isRTL ? "rtl" : "ltr"
    )}>
      <PageHeader
        title={t('navigation.roles')}
        description={t('roles.description')}
        isRTL={isRTL}
      >
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-[#1A5F5E] hover:bg-[#1A5F5E]/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          {t('roles.add')}
        </Button>
      </PageHeader>

      <Card className="p-6">
        <DataTable
          data={roles}
          columns={columns}
          searchable
          pagination
          pageSize={10}
          onEdit={(role) => {
            setSelectedRole(role);
            setIsEditDialogOpen(true);
          }}
          onDelete={(role) => {
            setSelectedRole(role);
            setIsDeleteDialogOpen(true);
          }}
        />
      </Card>

      <AddRoleDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAddRole={handleAddRole}
      />
      
      <EditRoleDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onEditRole={handleEditRole}
        role={selectedRole}
      />

      <DeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteRole}
        title={t('roles.delete')}
        description={t('roles.deleteDescription')}
      />
      </div>
  );
};

export default RolesPage;
