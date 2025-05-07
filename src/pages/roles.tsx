import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { DataTable } from '@/components/ui/data-table';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AddRoleDialog } from '@/components/dialogs/add-role-dialog';
import { EditRoleDialog } from '@/components/dialogs/edit-role-dialog';
import { DeleteDialog } from '@/components/dialogs/delete-dialog';
import { PageHeader } from '@/components/ui/page-header';
import { sampleRoles } from '@/lib/sample-data/roles';

interface Role {
  id: string;
  username: string;
  email: string;
  identity: string;
  role: string;
  joinDate: string;
}

const RolesPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);

  const isRTL = i18n.dir() === 'rtl';

  // On mount, load Arabic mock data
  useEffect(() => {
    // Map sampleRoles to the expected Role interface for the table
    setRoles(sampleRoles.map((r, i) => ({
      id: r.id,
      username: r.name + '.' + r.id,
      email: r.name + '@kendo.ps',
      identity: String(1000 + i),
      role: i < 2 ? 'manager' : 'staff',
      joinDate: '2024-01-01T08:00:00Z',
    })));
  }, []);

  const handleAddRole = (newRole: Role) => {
    setRoles([...roles, newRole]);
    toast({
      title: t('roles.addSuccess'),
      variant: 'success'
    });
    setIsAddDialogOpen(false);
  };

  const handleEditRole = (updatedRole: Role) => {
    setRoles(roles.map(role => role.id === updatedRole.id ? updatedRole : role));
    toast({
      title: t('roles.editSuccess'),
      variant: 'success'
    });
    setIsEditDialogOpen(false);
    setSelectedRole(null);
  };

  const handleDeleteRole = () => {
    if (selectedRole) {
      setRoles(roles.filter(role => role.id !== selectedRole.id));
      toast({
        title: t('roles.deleteSuccess'),
        variant: 'success'
      });
      setIsDeleteDialogOpen(false);
      setSelectedRole(null);
    }
  };

  const columns = [
    {
      key: 'username' as keyof Role,
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
      key: 'email' as keyof Role,
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
      key: 'identity' as keyof Role,
      title: t('table.headers.roles.identity'),
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
      key: 'role' as keyof Role,
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
      key: 'joinDate' as keyof Role,
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
