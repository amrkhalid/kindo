import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { DataTable } from "@/components/ui/data-table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { KindergartenDialog } from "@/components/dialogs/kindergarten-dialog";
import { DeleteDialog } from "@/components/dialogs/delete-dialog";
import { Column } from "@/types/data-table";
import {
  createKindergarten,
  CreateKindergartenRequest,
  deleteKindergarten,
  getAllKgs,
  Kindergarten,
  Plan,
  updateKindergarten,
} from "@/api/Kindergarten/Kindergartens/kindergartenApis";
import { getPlans } from "@/api/Subscribtion/Plans/PlanApis";

const KindergartensPage = () => {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const [kindergartens, setKindergartens] = useState<Kindergarten[]>([]);
  const [selectedKindergarten, setSelectedKindergarten] =
    useState<Kindergarten | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);

  // List of available languages with their directions
  const languages = [
    { code: "en", label: "English", dir: "ltr" },
    { code: "ar", label: "العربية", dir: "rtl" },
    { code: "he", label: "עברית", dir: "rtl" },
  ];

  const [plans, setPlans] = useState<Plan[]>([]);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await getPlans();
        setPlans(response.data);
      } catch (err) {
        console.error("Error fetching Plans:", err);
        toast({
          variant: "destructive",
          title: t("common.error"),
          description: t("plans.fetchError"),
        });
      }
    };

    fetchPlans();
  });

  const isRTL =
    languages.find((lang) => lang.code === i18n.language)?.dir === "rtl";

  const columns: Column<Kindergarten>[] = [
    {
      key: "name",
      title: t("table.headers.kindergartens.name"),
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
      key: "address",
      title: t("table.headers.kindergartens.address"),
      render: (value: string) => (
        <div
          className={cn("text-gray-600", isRTL ? "text-right" : "text-left")}
        >
          {value}
        </div>
      ),
    },
    {
      key: "phone_number",
      title: t("table.headers.kindergartens.phoneNumber"),
      render: (value: string) => (
        <div
          className={cn("text-gray-600", isRTL ? "text-right" : "text-left")}
        >
          {value}
        </div>
      ),
    },
    {
      key: "is_active",
      title: t("table.headers.kindergartens.isActive"),
      render: (value: boolean) => (
        <Badge
          className={
            value ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }
        >
          {value ? t("common.active") : t("common.inactive")}
        </Badge>
      ),
    },
    {
      key: "created_at",
      title: t("table.headers.kindergartens.joinDate"),
      render: (value: string) => (
        <div
          className={cn("text-gray-600", isRTL ? "text-right" : "text-left")}
        >
          {new Date(value).toLocaleDateString()}
        </div>
      ),
    },
  ];

  useEffect(() => {
    setIsLoading(true);
    getAllKgs(15, page)
      .then((res) => {
        setKindergartens((prev) =>
          page === 1 ? res.data.data : [...prev, ...res.data.data]
        );
        setTotalPages(res.data.totalPages);
      })
      .catch((err) => {
        console.error("Error fetching KGs:", err);
      })
      .finally(() => setIsLoading(false));
  }, [page]);

  useEffect(() => {
    const handleScroll = () => {
      const nearBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 300;
      if (nearBottom && page < totalPages && !isLoading) {
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [page, totalPages, isLoading]);

  const handleAddKindergarten = async (data: CreateKindergartenRequest) => {
    setIsLoading(true);
    try {
      await createKindergarten(data);
      const res = await getAllKgs(15, page);
      setKindergartens(res.data.data);
      setIsAddDialogOpen(false);
      toast({
        title: t("common.success"),
        description: t("kindergartens.addSuccess"),
        variant: "success",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: t("common.error"),
        description: t("kindergartens.addError"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async (data: CreateKindergartenRequest) => {
    if (!selectedKindergarten) return;

    try {
      setIsLoading(true);

      await updateKindergarten(selectedKindergarten.id, data);
      setIsEditDialogOpen(false);
      setSelectedKindergarten(null);

      const res = await getAllKgs(15, page);
      setKindergartens(res.data.data);

      toast({
        title: t("common.success"),
        description: t("kindergartens.editSuccess"),
        variant: "success",
      });
    } catch (error) {
      console.error("Edit failed", error);
      toast({
        title: t("common.error"),
        description: t("kindergartens.editError"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedKindergarten) return;

    try {
      setIsLoading(true);

      await deleteKindergarten(selectedKindergarten.id);
      const res = await getAllKgs(15, page);
      setKindergartens(res.data.data);

      setIsDeleteDialogOpen(false);
      setSelectedKindergarten(null);

      toast({
        title: t("common.success"),
        description: t("kindergartens.deleteSuccess"),
        variant: "success",
      });
    } catch (error) {
      console.error("Delete failed", error);
      toast({
        title: t("common.error"),
        description: t("kindergartens.deleteError"),
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
            {t("navigation.kindergartens")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("kindergartens.description")}
          </p>
        </div>
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-[#1A5F5E] hover:bg-[#1A5F5E]/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          {t("kindergartens.add")}
        </Button>
      </div>

      <Card className="p-6">
        <DataTable
          columns={columns}
          data={kindergartens}
          searchable
          title={t("kindergartens.title")}
          isLoading={isLoading}
          onEdit={(kindergarten) => {
            setSelectedKindergarten(kindergarten);
            setIsEditDialogOpen(true);
          }}
          onDelete={(kindergarten) => {
            setSelectedKindergarten(kindergarten);
            setIsDeleteDialogOpen(true);
          }}
        />
      </Card>

      <KindergartenDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={handleAddKindergarten}
        isLoading={isLoading}
        plans={plans}
      />

      <KindergartenDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSubmit={handleEdit}
        defaultValues={selectedKindergarten}
        isLoading={isLoading}
        plans={plans}
      />

      <DeleteDialog
        title={t("kindergartens.delete")}
        description={t("kindergartens.deleteConfirmation")}
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {
          setIsDeleteDialogOpen(open);
          if (!open) {
            setSelectedKindergarten(null);
          }
        }}
        onConfirm={handleDelete}
        isLoading={isLoading}
      />
    </div>
  );
};

export default KindergartensPage;
