import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { DataTable } from "@/components/ui/data-table";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { ChildDialog } from "@/components/dialogs/child-dialog";
import { DeleteDialog } from "@/components/dialogs/delete-dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Column } from "@/types/data-table";
import { useRTL } from "@/hooks/use-rtl";
import { PageHeader } from "@/components/ui/page-header";
import {
  Child,
  createChild,
  CreateChildRequest,
  deleteChild,
  getAllChildren,
  updateChild,
} from "@/api/Kindergarten/Children/childrenApis";
import { AssignChildrenDialog } from "@/components/dialogs/assign-children-dialog";
import { getAllGroupsNames, Group } from "@/api/Kindergarten/Group/groupApis";
import { createGroupChildren } from "@/api/Kindergarten/Group_children/groupChildrenApis";
import { Badge } from "@/components/ui/badge";
import { createLeave } from "@/api/Kindergarten/Absence-leaves/leaveApis";
import { LeaveDialog } from "@/components/dialogs/add-leave-dialog";
import { createAbsence } from "@/api/Kindergarten/Absence-leaves/absenceApi";
import { AbsenceDialog } from "@/components/dialogs/add-absence-dialog";

const ChildrenPage: React.FC = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { isRTL } = useRTL();
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const Kg_id = localStorage.getItem("selectedKG");

  const columns: Column<Child>[] = [
    {
      key: "full_name",
      title: t("table.headers.children.fullName"),
      render: (_: any, row: any) => (
        <div
          className={cn(
            "font-medium text-[#1A5F5E]",
            isRTL ? "text-right" : "text-left"
          )}
        >
          {[row.first_name, row.second_name, row.third_name, row.last_name]
            .filter(Boolean)
            .join(" ")}
        </div>
      ),
    },
    {
      key: "birth_date",
      title: t("table.headers.children.dateOfBirth"),
      render: (value: string) => (
        <div
          className={cn("text-gray-600", isRTL ? "text-right" : "text-left")}
        >
          {new Date(value).toLocaleDateString()}
        </div>
      ),
    },
    {
      key: "father_idno",
      title: t("table.headers.children.fatherIdNumber"),
      render: (_: any, row: Child) => (
        <div
          className={cn("text-gray-600", isRTL ? "text-right" : "text-left")}
        >
          {row.fatheruser?.id_no}
        </div>
      ),
    },
    {
      key: "mother_idno",
      title: t("table.headers.children.motherIdNumber"),
      render: (_: any, row: Child) => (
        <div
          className={cn("text-gray-600", isRTL ? "text-right" : "text-left")}
        >
          {row.motheruser?.id_no}
        </div>
      ),
    },
    {
      key: "group",
      title: t("table.headers.children.groupId"),
      render: (value: string | undefined) => (
        <Badge
          className={
            value ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
          }
        >
          {value ? t("common.hasGroup") : t("common.noGroup")}
        </Badge>
      ),
    },
  ];

  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChildren, setSelectedChildren] = useState<Child | null>(null);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [groups, setGroups] = useState<Group[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);
  const [isAbsenceDialogOpen, setIsAbsenceDialogOpen] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    getAllChildren(15, page, Kg_id)
      .then((res) => {
        if (!isCancelled) {
          setChildren((prev) =>
            page === 1 ? res.data.data : [...prev, ...res.data.data]
          );
          setTotalPages(res.data.totalPages);
        }
      })
      .catch((err) => {
        console.error("Error fetching Children:", err);
      });

    return () => {
      isCancelled = true;
    };
  }, [page, Kg_id]);

  useEffect(() => {
    if (Kg_id) {
      getAllGroupsNames(Kg_id)
        .then((res) => {
          setGroups(res.data.data);
        })
        .catch((err) => {
          console.error("Error fetching groups:", err);
        });
    }
  }, [Kg_id]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 300 &&
        page < totalPages
      ) {
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [page, totalPages]);

  console.log(children);

  const handleAdd = async (data: CreateChildRequest) => {
    console.log(data);

    try {
      await createChild(Kg_id, data);
      const res = await getAllChildren(15, page, Kg_id);
      setChildren(res.data.data);
      setIsAddDialogOpen(false);
      toast({
        title: t("common.success"),
        description: t("children.addSuccess"),
        variant: "success",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: t("common.error"),
        description: t("children.addError"),
      });
    }
  };

  const handleEdit = async (data: CreateChildRequest) => {
    if (!selectedChildren) return;

    try {
      await updateChild(Kg_id, selectedChildren.id, {
        ...data,
        kg: Kg_id,
      });
      const res = await getAllChildren(15, page, Kg_id);
      setChildren(res.data.data);
      setIsEditDialogOpen(false);
      setSelectedChildren(null);
      toast({
        title: t("common.success"),
        description: t("children.editSuccess"),
        variant: "success",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: t("common.error"),
        description: t("children.editError"),
      });
    }
  };

  const handleDelete = async () => {
    if (!selectedChildren) return;

    console.log("selected", selectedChildren.id);

    try {
      await deleteChild(Kg_id, selectedChildren.id);
      const res = await getAllChildren(15, page, Kg_id);
      setChildren(res.data.data);
      setIsDeleteDialogOpen(false);
      setSelectedChildren(null);
      toast({
        title: t("common.success"),
        description: t("children.deleteSuccess"),
        variant: "success",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: t("common.error"),
        description: t("children.deleteError"),
      });
    }
  };

  const handleAssign = async (group: Group) => {
    if (!selectedChildren || !group) return;

    try {
      await createGroupChildren(Kg_id, {
        group_id: group.id,
        child_id: selectedChildren.id,
      });

      setIsAssignDialogOpen(false);
      setSelectedChildren(null);
      toast({
        title: t("common.success"),
        description: t("children.assignSuccess"),
        variant: "success",
      });
    } catch (error) {
      let errorMessage = t("children.assignError");
      if (error.response?.status === 409) {
        errorMessage = error.response.data?.error || errorMessage;
      }
      console.error("Error assigning child:", error);
      toast({
        variant: "destructive",
        title: errorMessage,
        description: t("children.assignError"),
      });
    }
  };

  const handleLeave = async (data: {
    date: string;
    time: string;
    note: string;
  }) => {
    if (!selectedChildren) return;

    try {
      await createLeave(Kg_id, {
        child_id: selectedChildren.id,
        date: data.date,
        time: data.time,
        note: data.note,
      });

      setIsLeaveDialogOpen(false);
      setSelectedChildren(null);
      toast({
        title: t("common.success"),
        description: t("children.leaveSuccess"),
        variant: "success",
      });
    } catch (error) {
      console.error("Error creating leave:", error);
      toast({
        variant: "destructive",
        title: t("common.error"),
        description: t("children.leaveError"),
      });
    }
  };

  const handleAbsence = async (data: {
    absence: string;
    date: string;
    time: string;
    note: string;
  }) => {
    if (!selectedChildren) return;

    try {
      await createAbsence(Kg_id, {
        child_id: selectedChildren.id,
        absence: data.absence,
        date: data.date,
        time: data.time,
        note: data.note,
      });

      setIsAbsenceDialogOpen(false);
      setSelectedChildren(null);
      toast({
        title: t("common.success"),
        description: t("children.absenceSuccess"),
        variant: "success",
      });
    } catch (error) {
      console.error("Error recording absence:", error);
      toast({
        variant: "destructive",
        title: t("common.error"),
        description: t("children.absenceError"),
      });
    }
  };

  return (
    <div className={cn("w-full px-6 py-6", isRTL ? "rtl" : "ltr")}>
      <PageHeader
        title={t("children.title")}
        description={t("children.description")}
        isRTL={isRTL}
      >
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-[#1A5F5E] hover:bg-[#1A5F5E]/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          {t("children.add")}
        </Button>
      </PageHeader>

      <Card className="w-full p-6 shadow-sm overflow-hidden mt-6">
        <DataTable
          columns={columns}
          data={children}
          onEdit={(selectedChildren) => {
            setSelectedChildren(selectedChildren);
            setIsEditDialogOpen(true);
          }}
          onDelete={(selectedChildren) => {
            setSelectedChildren(selectedChildren);
            setIsDeleteDialogOpen(true);
          }}
          onAssign={(child) => {
            setSelectedChildren(child);
            setIsAssignDialogOpen(true);
          }}
          onLeave={(child) => {
            setSelectedChildren(child);
            setIsLeaveDialogOpen(true);
          }}
          onAbsence={(child) => {
            setSelectedChildren(child);
            setIsAbsenceDialogOpen(true);
          }}
        />
      </Card>

      <ChildDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={handleAdd}
      />

      <DeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
        title={t("children.delete")}
        description={t("children.deleteConfirmation")}
      />

      <AssignChildrenDialog
        key={selectedChildren?.id}
        open={isAssignDialogOpen}
        onOpenChange={setIsAssignDialogOpen}
        onSubmit={handleAssign}
        child={selectedChildren}
        groups={groups}
      />

      <LeaveDialog
        open={isLeaveDialogOpen}
        onOpenChange={setIsLeaveDialogOpen}
        onSubmit={handleLeave}
        child={selectedChildren}
      />

      <AbsenceDialog
        open={isAbsenceDialogOpen}
        onOpenChange={setIsAbsenceDialogOpen}
        onSubmit={handleAbsence}
        child={selectedChildren}
      />
      
      <ChildDialog
        child={selectedChildren}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSubmit={handleEdit}
      />
    </div>
  );
};

export default ChildrenPage;
