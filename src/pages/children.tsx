import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { DataTable } from '@/components/ui/data-table';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { ChildDialog } from '@/components/dialogs/child-dialog';
import { DeleteDialog } from '@/components/dialogs/delete-dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Group } from '@/types/group';
import { Column } from '@/types/data-table';
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { useRTL } from "@/hooks/use-rtl";
import { PageHeader } from '@/components/ui/page-header';
import { Child, createChild, CreateChildRequest, deleteChild, getAllChildren, updateChild } from '@/api/Kindergarten/Children/childrenApis';

const ChildrenPage: React.FC = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { isRTL } = useRTL();
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10);
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
      {[
        row.first_name,
        row.second_name,
        row.third_name,
        row.last_name,
      ]
        .filter(Boolean)
        .join(" ")}
    </div>
  ),
},
    {
      key: "birth_date",
      title: t('table.headers.children.dateOfBirth'),
      render: (value: string) => (
        <div className={cn(
          "text-gray-600",
          isRTL ? "text-right" : "text-left"
        )}>
          {new Date(value).toLocaleDateString()}
          </div>
      ),
    },
     {
      key: "father_idno",
      title: t('table.headers.children.fatherIdNumber'),
      render: (_: any, row: Child) => (
      <div className={cn(
      "text-gray-600",
      isRTL ? "text-right" : "text-left"
      )}>
      {row.fatheruser?.id_no}
      </div>
  ),
    },
    {
      key: "mother_idno",
      title: t('table.headers.children.motherIdNumber'),
     render: (_: any, row: Child) => (
     <div className={cn(
      "text-gray-600",
      isRTL ? "text-right" : "text-left"
      )}>
      {row.motheruser?.id_no}
    </div>
     ),
    },
  ];

  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChildren, setSelectedChildren] = useState<Child | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    useEffect(() => {
        getAllChildren({ limit, page, kg_id: Kg_id })
          .then((res) => {
            setChildren(res.data.data);
            setTotalPages(res.data.totalPages);
          })
          .catch((err) => {
            console.error("Error fetching Children:", err);
          });
      }, [limit, page, Kg_id]);

  console.log(children);

  const handleAdd = async (data: CreateChildRequest) => {
    console.log(data);

    try {
      await createChild( Kg_id, data);
      const res = await getAllChildren({ limit, page, kg_id: Kg_id });
      setChildren(res.data.data);
      setIsAddDialogOpen(false);
      toast({
        title: t('common.success'),
        description: t('children.addSuccess'),
        variant: "success"
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: t('common.error'),
        description: t('children.addError'),
      });
    }
  };

  const handleEdit = async (data: CreateChildRequest) => {
      if (!selectedChildren) return;
    
      try {
    
      await updateChild(Kg_id,selectedChildren.id, {
      ...data,
      kg: Kg_id,
    });
      const res = await getAllChildren({ limit, page, kg_id: Kg_id });
      setChildren(res.data.data);
        setIsEditDialogOpen(false);
        setSelectedChildren(null);
       toast({
        title: t('common.success'),
        description: t('children.editSuccess'),
        variant: "success"
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: t('common.error'),
        description: t('children.editError'),
      });
    };
  }

  const handleDelete = async () => {
    if (!selectedChildren) return;

    console.log("selected",selectedChildren.id);

    try {
      await deleteChild(Kg_id,selectedChildren.id);
      const res = await getAllChildren({ limit, page, kg_id: Kg_id });
      setChildren(res.data.data);
      setIsDeleteDialogOpen(false);
      setSelectedChildren(null);
      toast({
        title: t('common.success'),
        description: t('children.deleteSuccess'),
        variant: "success"
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: t('common.error'),
        description: t('children.deleteError'),
      });
    }
  };

  return (
    <div className={cn("w-full px-6 py-6", isRTL ? "rtl" : "ltr")}>
      <PageHeader
        title={t('children.title')}
        description={t('children.description')}
        isRTL={isRTL}
      >
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-[#1A5F5E] hover:bg-[#1A5F5E]/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          {t('children.add')}
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

       <ChildDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={handleAdd}
      />

      <DeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
        title={t('children.delete')}
        description={t('children.deleteConfirmation')}
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
