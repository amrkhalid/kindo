import React, { useState, useEffect } from "react";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Column } from "@/types/data-table";
import {
  FeatureDialog,
  FeatureFormData,
} from "@/components/dialogs/feature-dialog";
import { useToast } from "@/hooks/use-toast";
import {
  getFeatures,
  updateFeature,
  createFeature,
  Feature,
} from "@/api/Subscribtion/Features/FeatureApis";

const FeaturesPage = () => {
  const { toast } = useToast();
  const [features, setFeatures] = useState<Feature[]>([]);
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { t, i18n } = useTranslation();

  const languages = [
    { code: "en", label: "English", dir: "ltr" },
    { code: "ar", label: "العربية", dir: "rtl" },
    { code: "he", label: "עברית", dir: "rtl" },
  ];

  const isRTL =
    languages.find((lang) => lang.code === i18n.language)?.dir === "rtl";

  const columns: Column<Feature>[] = [
    {
      key: "name",
      title: t("table.headers.features.name"),
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
      key: "enable",
      title: t("table.headers.features.enable"),
      render: (value: boolean) => (
        <Badge
          className={
            value ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }
        >
          {value ? t("common.enabled") : t("disabled")}
        </Badge>
      ),
    },
    {
      key: "buildIn",
      title: t("table.headers.features.buildIn"),
      render: (value: boolean) => (
        <Badge
          className={
            value ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"
          }
        >
          {value ? t("common.yes") : t("common.no")}
        </Badge>
      ),
    },
    {
      key: "created_at",
      title: t("table.headers.features.createdAt"),
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
    const fetchFeatures = async () => {
      setIsLoading(true);
      try {
        const res = await getFeatures(15, page);
        setFeatures((prev) =>
          page === 1 ? res.data.data : [...prev, ...res.data.data]
        );
        setTotalPages(res.data.totalPages);
      } catch (error) {
        toast({
          title: t("common.error"),
          description: t("features.fetchError"),
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeatures();
  }, [page]);

  useEffect(() => {
    const handleScroll = () => {
      if (isLoading) return;
      if (page >= totalPages) return;
      const nearBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 300;
      if (nearBottom) {
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLoading, page, totalPages]);

  const handleAddFeature = async (data: FeatureFormData) => {
    try {
      setIsLoading(true);
      await createFeature({
        featureData: {
          name: data.name,
          enable: data.enable,
          buildIn: data.buildIn,
        },
      });
      const res = await getFeatures(15, page);
      setFeatures(res.data.data);
      setIsAddDialogOpen(false);
      toast({
        title: t("common.success"),
        description: t("features.addSuccess"),
        variant: "success",
      });
    } catch (error) {
      console.error("Add feature error:", error);
      toast({
        title: t("common.error"),
        description: t("features.addError"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async (data: FeatureFormData & { _id?: string }) => {
    if (!data._id) {
      toast({
        title: t("common.error"),
        description: t("features.missingIdError"),
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      await updateFeature(data._id, { enable: data.enable });

      const res = await getFeatures(15, page);
      setFeatures(res.data.data);

      setIsEditDialogOpen(false);

      toast({
        title: t("common.success"),
        description: t("features.updateSuccess"),
        variant: "success",
      });
    } catch (error) {
      console.error("Error updating feature:", error);
      toast({
        title: t("common.error"),
        description: t("features.updateError"),
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
            {t("features.title")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("features.description")}
          </p>
        </div>
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-[#1A5F5E] hover:bg-[#1A5F5E]/90"
          disabled
        >
          <Plus className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
          {t("features.add")}
        </Button>
      </div>

      <Card className="p-6">
        <DataTable
          columns={columns}
          data={features}
          searchable
          isLoading={isLoading}
          onEdit={(feature) => {
            setSelectedFeature(feature);
            setIsEditDialogOpen(true);
          }}
        />
      </Card>

      <FeatureDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={handleAddFeature}
        isLoading={isLoading}
      />

      <FeatureDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSubmit={handleEdit}
        defaultValues={selectedFeature || undefined}
        isLoading={isLoading}
      />
    </div>
  );
};

export default FeaturesPage;
