import React, { useEffect, useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Plan, PlanRequest } from "@/types/plan";
import { Column } from "@/types/data-table";
import { DeleteDialog } from "@/components/dialogs/delete-dialog";
import { PlanDialog } from "@/components/dialogs/plan-dialog";
import { useToast } from "@/hooks/use-toast";
import { getPlans } from "@/api/Subscribtion/Plans/PlanApis";

const PlansPage: React.FC = () => {
  const { toast } = useToast();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const { t, i18n } = useTranslation();

  const languages = [
    { code: "en", label: "English", dir: "ltr" },
    { code: "ar", label: "العربية", dir: "rtl" },
    { code: "he", label: "עברית", dir: "rtl" },
  ];

  const isRTL =
    languages.find((lang) => lang.code === i18n.language)?.dir === "rtl";

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setIsLoading(true);
        const response = await getPlans();

        const plansData = response.data;

        if (!Array.isArray(plansData)) {
          throw new Error("Expected an array of plans");
        }

        setPlans(plansData);
      } catch (error) {
        toast({
          title: t("common.error"),
          description:
            (error as Error).message ||
            t("plans.fetchError") ||
            "Error fetching plans",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlans();
  }, [t, toast]);

  const handleUpdatePlan = async (planData: PlanRequest) => {
    if (!selectedPlan) return;

    try {
      setIsLoading(true);
      await updatePlan(selectedPlan.id, planData);
      toast({
        title: t("common.success"),
        description: t("plans.updateSuccess") || "Plan updated successfully",
        variant: "default",
      });
      setIsEditDialogOpen(false);
      setSelectedPlan(null);

      const response = await getPlans();
      setPlans(response.data);
    } catch (error) {
      toast({
        title: t("common.error"),
        description:
          (error as Error).message ||
          t("plans.updateError") ||
          "Failed to update plan",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const columns: Column<Plan>[] = [
    {
      key: "name" as keyof Plan,
      title: t("table.headers.plans.name"),
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
      key: "startDate" as keyof Plan,
      title: t("table.headers.plans.startDate"),
      render: (value: string) => (
        <div
          className={cn("text-gray-600", isRTL ? "text-right" : "text-left")}
        >
          {new Date(value).toLocaleDateString()}
        </div>
      ),
    },
    {
      key: "endDate" as keyof Plan,
      title: t("table.headers.plans.endDate"),
      render: (value: string) => (
        <div
          className={cn("text-gray-600", isRTL ? "text-right" : "text-left")}
        >
          {new Date(value).toLocaleDateString()}
        </div>
      ),
    },
    {
      key: "cost" as keyof Plan,
      title: t("table.headers.plans.cost"),
      render: (value: number) => (
        <div
          className={cn("text-gray-600", isRTL ? "text-right" : "text-left")}
        >
          ${value.toFixed(2)}
        </div>
      ),
    },
    {
      key: "discount" as keyof Plan,
      title: t("table.headers.plans.discount"),
      render: (value: number) => (
        <div
          className={cn("text-gray-600", isRTL ? "text-right" : "text-left")}
        >
          {value}%
        </div>
      ),
    },
    {
      key: "enable" as keyof Plan,
      title: t("table.headers.plans.enable"),
      render: (value: boolean) => (
        <Badge
          className={
            value ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }
        >
          {value ? t("common.enabled") : t("common.disabled")}
        </Badge>
      ),
    },
    {
      key: "buildIn" as keyof Plan,
      title: t("table.headers.plans.buildIn"),
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
  ];

  const handleAdd = () => {
    setSelectedPlan(null);
    setIsAddDialogOpen(true);
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
            {t("plans.title")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("plans.description")}
          </p>
        </div>
        <Button
          onClick={handleAdd}
          className="bg-[#1A5F5E] hover:bg-[#1A5F5E]/90"
        >
          <Plus className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
          {t("plans.add")}
        </Button>
      </div>

      <Card className="p-6">
        <DataTable
          columns={columns}
          data={plans}
          searchable
          title={t("plans.title")}
          onEdit={(plan) => {
            setSelectedPlan(plan);
            setIsEditDialogOpen(true);
          }}
          onDelete={(plan) => {
            setSelectedPlan(plan);
            setIsDeleteDialogOpen(true);
          }}
        />
      </Card>

      <PlanDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />

      {isEditDialogOpen && selectedPlan && (
        <PlanDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          plan={selectedPlan}
          onSubmit={handleUpdatePlan}
        />
      )}

      <DeleteDialog
        title={t("plans.delete")}
        description={t("plans.deleteConfirmation")}
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {
          setIsDeleteDialogOpen(open);
          if (!open) setSelectedPlan(null);
        }}
        onConfirm={() => {}}
        isLoading={isLoading}
      />
    </div>
  );
};

export default PlansPage;
