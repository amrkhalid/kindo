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
import { createRole, deleteRole, getAllRoles, Role, updateRole } from '@/api/Kindergarten/Kg_roles/rolesApis';

const RolesPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const Kg_id = localStorage.getItem("selectedKG");
  const isRTL = i18n.dir() === 'rtl';

    useEffect(() => {
        getAllRoles(limit, page, Kg_id)
          .then((res) => {  
        setRoles(res.data.data);
        setTotalPages(res.data.totalPages);
          })
          .catch((err) => {
            console.error("Error fetching Roles:", err);
          });
      }, [limit, page, Kg_id]);


  console.log("roles",roles)

  const handleAddRole = async ({ identity, role }: { identity: string; role: string }) => {
    try {
      await createRole(Kg_id, {
        idno: identity,
        role,
      });
      const res = await getAllRoles(limit, page, Kg_id);
      setRoles(res.data.data);
 
      toast({
        title: t("roles.addSuccess"),
        description: `${identity ?? "—"} ${t('roles.addDescription')}`,
        variant: "success"
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
      await updateRole(Kg_id, {
        role,
      },selectedRole.id);

      const res = await getAllRoles(limit, page, Kg_id);
      setRoles(res.data.data);
      toast({
        title: t('roles.editSuccess'),
        description: t('roles.editSuccess'),
        variant: "success"
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
        const res = await getAllRoles(limit, page, Kg_id);
        setRoles(res.data.data);
        setIsDeleteDialogOpen(false);
        setSelectedRole(null);
        toast({
          title: t('common.success'),
          description: t('roles.deleteSuccess'),
          variant: "success"
        });
      } catch (error) {
        toast({
          title: t('common.error'),
          description: t('roles.deleteError'),
          variant: 'destructive',
        });

  };}

  const columns: Column<Role>[] = [
{
  key: "full_name",
  title: t("table.headers.children.fullName"),
  render: (_: any, row: Role) => (
    <div
      className={cn(
        "font-medium text-[#1A5F5E]",
        isRTL ? "text-right" : "text-left"
      )}
    >
      {[
        row.user.first_name,
        row.user.second_name,
        row.user.third_name,
        row.user.last_name,
      ]
        .filter(Boolean)
        .join(" ")}
    </div>
  ),
},    
    {
      key: 'username',
      title: t('table.headers.roles.username'),
      render: (_: any, row: Role) => (
      <div className={cn(
      "text-gray-600",
      isRTL ? "text-right" : "text-left"
      )}>
      {row.user?.username}
      </div>
  ),
    },
    {
      key: 'email',
      title: t('table.headers.roles.email'),
      render: (_: any, row: Role) => (
      <div className={cn(
      "text-gray-600",
      isRTL ? "text-right" : "text-left"
      )}>
      {row.user?.email}
      </div>
  ),
    },
    {
      key: 'phone_number',
      title: t('table.headers.systemUsers.phoneNumber'),
      render: (_: any, row: Role) => (
      <div className={cn(
      "text-gray-600",
      isRTL ? "text-right" : "text-left"
      )}>
      {row.user?.phone_number}
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
      key: 'created_at',
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
                <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2 items-center">
            <label>{t("Rows per page")}:</label>
            <select
              value={limit}
              onChange={(e) => {
                setPage(1);
                setLimit(Number(e.target.value));
              }}
              className="border rounded px-2 py-1"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>

          <div className="flex gap-2 py-5">
            <Button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
            >
              {t("Previous")}
            </Button>
            <span className="py-2">
              {t("Page")}: {page} / {totalPages}
            </span>
            <Button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page >= totalPages}
            >
              {t("Next")}
            </Button>
          </div>
        </div>

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
