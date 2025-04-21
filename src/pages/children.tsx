
import React, { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { DataTable } from "@/components/ui/data-table";
import { children as initialChildren } from "@/lib/data";
import { AddChildDialog } from "@/components/dialogs/add-child-dialog";
import { Child } from "@/types";
import { useToast } from "@/hooks/use-toast";

const ChildrenPage = () => {
  const { toast } = useToast();
  const [children, setChildren] = useState<Child[]>(initialChildren);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const columns = [
    {
      key: "firstName",
      title: "First Name",
    },
    {
      key: "secondName",
      title: "Second Name",
    },
    {
      key: "thirdName",
      title: "Third Name",
    },
    {
      key: "lastName",
      title: "Last Name",
    },
    {
      key: "fatherIdNumber",
      title: "Father ID",
    },
    {
      key: "motherIdNumber",
      title: "Mother ID",
    },
    {
      key: "birthDate",
      title: "Birth Date",
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
  ];

  const handleAddChild = (newChild: Child) => {
    setChildren([...children, newChild]);
    toast({
      title: "Child added",
      description: `${newChild.firstName} ${newChild.lastName} has been added successfully`,
    });
  };

  return (
    <MainLayout>
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Children</h1>
        <p className="text-muted-foreground">Manage children's information</p>

        <DataTable
          columns={columns}
          data={children}
          title="All Children"
          onAdd={() => setIsAddDialogOpen(true)}
        />

        <AddChildDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onAddChild={handleAddChild}
        />
      </div>
    </MainLayout>
  );
};

export default ChildrenPage;
