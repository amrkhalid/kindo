import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { DataTable } from "@/components/ui/data-table";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { DeleteDialog } from "@/components/dialogs/delete-dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Column } from "@/types/data-table";
import { useRTL } from "@/hooks/use-rtl";
import { PageHeader } from "@/components/ui/page-header";
import { deleteGroupChildren } from "@/api/Kindergarten/Group_children/groupChildrenApis";
import { getAllGroups, Group } from "@/api/Kindergarten/Group/groupApis";
import { APP } from "@/constants/app";

interface ChildDetails {
  _id: string;
  first_name: string;
  second_name: string;
  third_name: string;
  last_name: string;
  birth_date: string;
  father_id?: string;
  mother_id?: string;
}

interface GroupChild {
  _id: string;
  group_id: string;
  child_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  childDetails: ChildDetails;
}

const GroupChildrenListPage: React.FC = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { isRTL } = useRTL();
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const Kg_id = localStorage.getItem("selectedKG");

  const columns: Column<GroupChild>[] = [
    {
      key: "full_name",
      title: t("table.headers.children.fullName"),
      render: (_, row) => (
        <div
          className={cn(
            "font-medium text-[#1A5F5E]",
            isRTL ? "text-right" : "text-left"
          )}
        >
          {[
            row.childDetails.first_name,
            row.childDetails.second_name,
            row.childDetails.third_name,
            row.childDetails.last_name,
          ]
            .filter(Boolean)
            .join(" ")}
        </div>
      ),
    },
    {
      key: "birth_date",
      title: t("table.headers.children.dateOfBirth"),
      render: (_, row) => (
        <div
          className={cn("text-gray-600", isRTL ? "text-right" : "text-left")}
        >
          {new Date(row.childDetails.birth_date).toLocaleDateString()}
        </div>
      ),
    },
  ];

  const [children, setChildren] = useState<GroupChild[]>([]);
  const [groupName, setGroupName] = useState("");
  const [selectedChild, setSelectedChild] = useState<GroupChild | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!groupId || !Kg_id) return;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        const response = await getAllGroups(limit, page, Kg_id);        
        const group = response.data.data.find((g: Group) => g.id === groupId);
        
        if (group) {
          setGroupName(group.name);
          setChildren(group.children|| []);
        } else {
          throw new Error("Group not found");
        }
      } catch (error) {
        toast({
          title: t("common.error"),
          description: t("groups.fetchChildrenError"),
          variant: "destructive",
        });
        navigate(APP.ROUTES.GROUPS);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [groupId, Kg_id, toast, t, navigate, limit, page]);

  const handleDelete = async () => {
    if (!selectedChild || !Kg_id) return;

    try {
      setIsLoading(true);
      await deleteGroupChildren(Kg_id, selectedChild._id);
        const response = await getAllGroups(limit, page, Kg_id);
        const group = response.data.data.find((g: Group) => g.id === groupId);
        
        if (group) {
          setGroupName(group.name);
          setChildren(group.children|| []);}
      
      toast({
        title: t("common.success"),
        description: t("groups.childRemoveSuccess"),
        variant: "success",
      });
    } catch (error) {
      toast({
        title: t("common.error"),
        description: t("groups.childRemoveError"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <div className={cn("w-full px-6 py-6", isRTL ? "rtl" : "ltr")}>
      <PageHeader
        title={`${t("groups.childrenForGroup")}: ${groupName}`}
        description={t("groups.childrenDescription")}
        isRTL={isRTL}
      >
        <Button
          onClick={() => navigate(APP.ROUTES.GROUPS)}
          variant="outline"
          className={cn("flex items-center", isRTL ? "flex-row-reverse" : "flex-row")}
        >
          <ChevronLeft className="w-4 h-4" />
          <span className={isRTL ? "mr-2" : "ml-2"}>{t("common.back")}</span>
        </Button>
      </PageHeader>

      <Card className="w-full p-6 shadow-sm overflow-hidden mt-6">
        <DataTable
          columns={columns}
          data={children}
          onDelete={(child) => {
            setSelectedChild(child);
            setIsDeleteDialogOpen(true);
          }}
          isLoading={isLoading}
        />
      </Card>

      <DeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
        isLoading={isLoading}
        title={t("groups.deleteChildTitle")}
        description={t("groups.deleteChildDescription")}
      />
    </div>
  );
};

export default GroupChildrenListPage;