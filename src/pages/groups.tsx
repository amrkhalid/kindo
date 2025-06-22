import React, { useEffect, useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { GroupDialog } from "@/components/dialogs/group-dialog";
import { DeleteDialog } from "@/components/dialogs/delete-dialog";
import type { Column } from "@/types/data-table";
import {
  createGroup,
  CreateGroupRequest,
  deleteGroup,
  getAllGroups,
  Group,
  updateGroup,
} from "@/api/Kindergarten/Group/groupApis";
import {
  Child,
  getAllChildren,
  getAllChildrenNames,
} from "@/api/Kindergarten/Children/childrenApis";
import {
  createGroupStaff,
  getAllStaff,
  Staff,
} from "@/api/Kindergarten/Group_staff/staffApis";
import { createGroupChildren } from "@/api/Kindergarten/Group_children/groupChildrenApis";
import { useNavigate } from "react-router-dom";
import { APP } from "@/constants/app";

export default function GroupsPage() {
  const { toast } = useToast();
  const [groups, setGroups] = useState<Group[]>([]);
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [childrenList, setChildrenList] = useState<Child[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const { t, i18n } = useTranslation();
  const Kg_id = localStorage.getItem("selectedKG");

  // List of available languages with their directions
  const languages = [
    { code: "en", label: "English", dir: "ltr" },
    { code: "ar", label: "العربية", dir: "rtl" },
    { code: "he", label: "עברית", dir: "rtl" },
  ];

  const isRTL =
    languages.find((lang) => lang.code === i18n.language)?.dir === "rtl";

  useEffect(() => {
    setIsLoading(true);

    const fetchData = async () => {
      try {
        const [groupsRes, staffRes, childrenRes] = await Promise.all([
          getAllGroups(15, page, Kg_id),
          getAllStaff(Kg_id),
          getAllChildrenNames(Kg_id),
        ]);

        setGroups((prev) =>
          page === 1 ? groupsRes.data.data : [...prev, ...groupsRes.data.data]
        );
        setTotalPages(groupsRes.data.totalPages);
        setStaffList(staffRes.data.data);
        setChildrenList(childrenRes.data.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (Kg_id) fetchData();
  }, [page, Kg_id]);

  useEffect(() => {
    const handleScroll = () => {
      const isBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 300;

      if (isBottom && page < totalPages && !isLoading) {
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [page, totalPages, isLoading]);

  console.log("g", groups);

  const columns: Column<Group>[] = [
    {
      key: "name",
      title: t("table.headers.groups.name"),
      render: (value: string) => (
        <div
          className={cn(
            "font-medium text-[#1A5F5E]",
            isRTL ? "text-right" : "text-left"
          )}
        >
          {value}
        </div>
      ),
    },
    {
      key: "staff",
      title: t("table.headers.groups.staff"),
      render: (_, group) => (
        <div className="flex flex-col">
          {group.staff && group.staff.length > 0 ? (
            <div
              className={cn(
                "font-medium text-[#1A5F5E]",
                isRTL ? "text-right" : "text-left"
              )}
            >
              <div>{group.staff[0]?.name}</div>
            </div>
          ) : (
            <span className="text-gray-500">{t("groups.noStaff")}</span>
          )}
        </div>
      ),
    },
    {
      key: "children",
      title: t("table.headers.groups.children"),
      render: (_, group) => (
        <div className="flex flex-col">
          {group.children && group.children.length > 0 ? (
            <div className="flex items-center gap-2">
              <span>{group.children.length}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  navigate(`${APP.ROUTES.GROUP_CHILDREN}/${group.id}`)
                }
              >
                {t("groups.viewChildren")}
              </Button>
            </div>
          ) : (
            <span className="text-gray-500">{t("groups.noChildren")}</span>
          )}
        </div>
      ),
    },
  ];

  const handleAdd = async (data: {
    name: string;
    staffId?: string;
    childrenIds?: string[];
  }) => {
    console.log("data", data);
    setIsLoading(true);

    let createdGroupId = "";

    try {
      const groupResponse = await createGroup(Kg_id, { name: data.name });
      createdGroupId = groupResponse.data.id;

      if (data.childrenIds && data.childrenIds.length > 0) {
        for (const childId of data.childrenIds) {
          await createGroupChildren(Kg_id, {
            group_id: createdGroupId,
            child_id: childId,
          });
        }
      }

      if (data.staffId) {
        await createGroupStaff(Kg_id, {
          group_id: createdGroupId,
          staff_id: data.staffId,
        });
      }

      const res = await getAllGroups(15, page, Kg_id);
      setGroups(res.data.data);
      setIsAddDialogOpen(false);
      toast({
        title: t("common.success"),
        description: t("groups.addSuccess"),
        variant: "success",
      });
    } catch (error: any) {
      console.error("Error during group creation:", error);

      if (createdGroupId) {
        try {
          await deleteGroup(Kg_id, createdGroupId);
          console.log("Group rolled back (deleted) due to error");
        } catch (rollbackError) {
          console.error("Failed to rollback (delete group):", rollbackError);
        }
      }

      let errorMessage = t("groups.addError");
      if (error.response?.status === 409) {
        errorMessage = error.response.data?.error || errorMessage;
      }

      toast({
        title: t("common.error"),
        description: errorMessage,
        variant: "destructive",
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
      await updateGroup(Kg_id, data, selectedGroup.id);
      const res = await getAllGroups(15, page, Kg_id);
      setGroups(res.data.data);

      setIsEditDialogOpen(false);
      setSelectedGroup(null);
      toast({
        title: t("common.success"),
        description: t("groups.editSuccess"),
        variant: "success",
      });
    } catch (error) {
      toast({
        title: t("common.error"),
        description: t("groups.editError"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedGroup) return;

    try {
      setIsLoading(true);
      await deleteGroup(Kg_id, selectedGroup.id);
      const res = await getAllGroups(15, page, Kg_id);
      setGroups(res.data.data);
      setIsDeleteDialogOpen(false);
      setSelectedGroup(null);
      toast({
        title: t("common.success"),
        description: t("groups.deleteSuccess"),
        variant: "success",
      });
    } catch (error) {
      toast({
        title: t("common.error"),
        description: t("groups.deleteError"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("space-y-4", isRTL ? "rtl" : "ltr")}>
      <div
        className={cn(
          "flex items-center justify-between border-b pb-4",
          isRTL ? "flex-row-reverse" : "flex-row"
        )}
      >
        <div>
          <h1 className="text-3xl font-bold text-[#1A5F5E]">
            {t("groups.title")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("groups.description")}
          </p>
        </div>
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-[#1A5F5E] hover:bg-[#1A5F5E]/90"
        >
          <Plus className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
          {t("groups.add")}
        </Button>
      </div>

      <Card className="p-6">
        <DataTable
          columns={columns}
          data={groups}
          searchable
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
        staffList={staffList}
        childrenList={childrenList}
      />

      <GroupDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSubmit={handleEditSubmit}
        defaultValues={selectedGroup}
        isLoading={isLoading}
        isEditMode={true}
      />

      <DeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
        isLoading={isLoading}
        title={t("groups.deleteTitle")}
        description={t("groups.deleteDescription")}
      />
    </div>
  );
}
