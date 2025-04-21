
import React, { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { DataTable } from "@/components/ui/data-table";
import { groups as initialGroups, children, users } from "@/lib/data";
import { AddGroupDialog } from "@/components/dialogs/add-group-dialog";
import { Group, Child } from "@/types";
import { useToast } from "@/hooks/use-toast";

const GroupsPage = () => {
  const { toast } = useToast();
  const [groups, setGroups] = useState<Group[]>(initialGroups);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  // Extract staff names from users data
  const staffMembers = users
    .filter(user => user.role === "staff")
    .map(user => user.username);

  const columns = [
    {
      key: "name",
      title: "Group Name",
    },
    {
      key: "staffName",
      title: "Staff Member",
    },
    {
      key: "children",
      title: "Children",
      render: (children: Child[]) => (
        <div className="max-w-[200px] truncate">
          {children.map(child => `${child.firstName} ${child.lastName}`).join(", ")}
        </div>
      ),
    },
    {
      key: "childCount",
      title: "Child Count",
      render: (_: any, row: Group) => row.children.length,
    },
    {
      key: "createdAt",
      title: "Created At",
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
  ];

  const handleAddGroup = (newGroup: Group) => {
    setGroups([...groups, newGroup]);
    toast({
      title: "Group added",
      description: `${newGroup.name} group has been created successfully`,
    });
  };

  return (
    <MainLayout>
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Groups</h1>
        <p className="text-muted-foreground">Manage children groups and assignments</p>

        <DataTable
          columns={columns}
          data={groups}
          title="All Groups"
          onAdd={() => setIsAddDialogOpen(true)}
        />

        <AddGroupDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onAddGroup={handleAddGroup}
          availableChildren={children}
          staffMembers={staffMembers}
        />
      </div>
    </MainLayout>
  );
};

export default GroupsPage;
