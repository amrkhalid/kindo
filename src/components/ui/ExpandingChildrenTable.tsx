import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import type { Column } from "@/types/data-table";
import { DeleteDialog } from "@/components/dialogs/delete-dialog";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { deleteGroupChildren } from "@/api/Kindergarten/Group_children/groupChildrenApis";

interface ExpandingChildrenTableProps<T> {
  children: T[];
  columns: Column<T>[];
  groupId: string;
  onDeleteSuccess?: () => void;
}

export function ExpandingChildrenTable<T extends { id: string }>({
  children,
  columns,
  groupId,
  onDeleteSuccess,
}: ExpandingChildrenTableProps<T>) {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedChild, setSelectedChild] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const Kg_id = localStorage.getItem("selectedKG");

  console.log("seletetd child",selectedChild);


  const handleDelete = async () => {
    if (!selectedChild || !Kg_id) return;
    console.log("seletetd child id",selectedChild._id)

    try {
      setIsLoading(true);
      await deleteGroupChildren(Kg_id, selectedChild._id);
      toast({
        title: t("common.success"),
        description: t("groups.childRemoveSuccess"),
        variant: "success",
      });
      onDeleteSuccess?.();
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
    <div className="space-y-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-1"
      >
        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </Button>

      {isExpanded && (
        <div className="ml-4 border-l-2 border-gray-200 pl-4">
          <DataTable
            columns={columns}
            data={children}
            hidePagination
            hideSearch
            className="bg-gray-50 rounded-lg p-2"
            onDelete={(child) => {
              setSelectedChild(child);
              setIsDeleteDialogOpen(true);
            }}
          />
        </div>
      )}

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
}