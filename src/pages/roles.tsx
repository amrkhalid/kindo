
import React, { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { DataTable } from "@/components/ui/data-table";
import { users as initialUsers } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { AddRoleDialog } from "@/components/dialogs/add-role-dialog";
import { User } from "@/types";
import { useToast } from "@/hooks/use-toast";

const RolesPage = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const columns = [
    {
      key: "username",
      title: "Username",
    },
    {
      key: "email",
      title: "Email",
    },
    {
      key: "identity",
      title: "ID",
    },
    {
      key: "role",
      title: "Role",
      render: (value: string) => (
        <Badge className={value === "manager" ? "bg-blue-500" : "bg-green-500"}>
          {value}
        </Badge>
      ),
    },
    {
      key: "joinDate",
      title: "Join Date",
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
  ];

  const handleAddRole = (newRole: User) => {
    setUsers([...users, newRole]);
    toast({
      title: "Role added",
      description: `${newRole.username} has been added as ${newRole.role}`,
    });
  };

  return (
    <MainLayout>
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Staff Roles</h1>
        <p className="text-muted-foreground">Manage staff members and their roles</p>

        <DataTable
          columns={columns}
          data={users}
          title="All Staff"
          onAdd={() => setIsAddDialogOpen(true)}
        />

        <AddRoleDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onAddRole={handleAddRole}
        />
      </div>
    </MainLayout>
  );
};

export default RolesPage;
