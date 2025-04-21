
import React, { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { DataTable } from "@/components/ui/data-table";
import { kindergartens as initialKindergartens } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { AddKindergartenDialog } from "@/components/dialogs/add-kindergarten-dialog";
import { Kindergarten } from "@/types";
import { useToast } from "@/hooks/use-toast";

const KindergartensPage = () => {
  const { toast } = useToast();
  const [kindergartens, setKindergartens] = useState<Kindergarten[]>(initialKindergartens);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const columns = [
    {
      key: "name",
      title: "Name",
    },
    {
      key: "address",
      title: "Address",
    },
    {
      key: "phoneNumber",
      title: "Phone",
    },
    {
      key: "isActive",
      title: "Status",
      render: (value: boolean) => (
        <Badge className={value ? "bg-green-500" : "bg-red-500"}>
          {value ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      key: "joinDate",
      title: "Join Date",
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      key: "createdBy",
      title: "Created By",
    },
  ];

  const handleAddKindergarten = (newKindergarten: Kindergarten) => {
    setKindergartens([...kindergartens, newKindergarten]);
    toast({
      title: "Kindergarten added",
      description: `${newKindergarten.name} has been added successfully`,
    });
  };

  return (
    <MainLayout>
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Kindergartens</h1>
        <p className="text-muted-foreground">Manage your kindergarten locations</p>

        <DataTable
          columns={columns}
          data={kindergartens}
          title="All Kindergartens"
          onAdd={() => setIsAddDialogOpen(true)}
        />

        <AddKindergartenDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onAddKindergarten={handleAddKindergarten}
        />
      </div>
    </MainLayout>
  );
};

export default KindergartensPage;
