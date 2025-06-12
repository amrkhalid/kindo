import React, { useEffect, useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Plan } from "@/types/plan";
import { Column } from "@/types/data-table";
import { DeleteDialog } from "@/components/dialogs/delete-dialog";
import { PlanDialog, PlanFormData } from "@/components/dialogs/plan-dialog";
import { useToast } from "@/hooks/use-toast";
import {
  getPlans,
  createPlan,
  updatePlan,
  PlanUpdateRequest,
  DEFAULT_FEATURES,
  PlanRequest,
} from "@/api/Subscribtion/Plans/PlanApis";

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
      setIsLoading(true);

      try {
        const res = await getPlans();
        const plansData = res.data.map((plan) => ({
          ...plan,
          cost: plan.cost || 0,
          discount: plan.discount || 0,
        }));
        setPlans(plansData);
        console.log("plans", plans);
        setIsLoading(false);
      } catch (error) {
        toast({
          title: t("common.error"),
          description: t("plans.fetchError"),
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const handleAddPlan = async (data: PlanFormData) => {
    try {
      setIsLoading(true);

      const requestData: PlanRequest = {
        planData: {
          name: data.name,
          startDate: new Date(data.startDate).toISOString(),
          endDate: new Date(data.endDate).toISOString(),
          cost: data.cost,
          discount: data.discount,
          enable: data.enable,
          buildIn: data.buildIn,
        },
        features: DEFAULT_FEATURES,
      };
      await createPlan(requestData);
      const res = await getPlans();
      const plansData = res.data.map((plan) => ({
        ...plan,
        cost: plan.cost || 0,
        discount: plan.discount || 0,
      }));

      setPlans(plansData);
      setIsAddDialogOpen(false);
      toast({
        title: t("common.success"),
        description: t("plans.addSuccess"),
        variant: "success",
      });
    } catch (error) {
      toast({
        title: t("common.error"),
        description: t("plans.addError"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePlan = async (data: PlanFormData) => {
    if (!selectedPlan?.id) return;

    try {
      setIsLoading(true);
      const requestData: PlanUpdateRequest = {
        updateData: {
          name: data.name,
          startDate: new Date(data.startDate).toISOString(),
          endDate: new Date(data.endDate).toISOString(),
          cost: data.cost,
          discount: data.discount,
          enable: data.enable,
          buildIn: data.buildIn,
        },
      };
      await updatePlan(selectedPlan.id, requestData);
      const response = await getPlans();
      const plansData = response.data.map((plan) => ({
        ...plan,
        cost: plan.cost || 0,
        discount: plan.discount || 0,
      }));
      setPlans(plansData);
      setIsEditDialogOpen(false);
      setSelectedPlan(null);
      toast({
        title: t("common.success"),
        description: t("plans.updateSuccess"),
        variant: "success",
      });
    } catch (error) {
      toast({
        title: t("common.error"),
        description: t("plans.updateError"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const columns: Column<Plan>[] = [
    {
      key: "name",
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
      key: "startDate",
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
      key: "endDate",
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
      key: "cost",
      title: t("table.headers.plans.cost"),
      render: (value: number | undefined) => (
        <div
          className={cn("text-gray-600", isRTL ? "text-right" : "text-left")}
        >
          ${(value || 0).toFixed(2)}
        </div>
      ),
    },
    {
      key: "discount",
      title: t("table.headers.plans.discount"),
      render: (value: number | undefined) => (
        <div
          className={cn("text-gray-600", isRTL ? "text-right" : "text-left")}
        >
          {value || 0}%
        </div>
      ),
    },
    {
      key: "enable",
      title: t("table.headers.plans.enable"),
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
          onClick={() => setIsAddDialogOpen(true)}
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
          loading={isLoading}
          onEdit={(plan) => {
            setSelectedPlan(plan);
            setIsEditDialogOpen(true);
          }}
          // onDelete={(plan) => {
          //   setSelectedPlan(plan);
          //   setIsDeleteDialogOpen(true);
          // }}
        />
      </Card>

      <PlanDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={handleAddPlan}
        isLoading={isLoading}
      />

      <PlanDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSubmit={handleUpdatePlan}
        defaultValues={selectedPlan || undefined}
        isLoading={isLoading}
      />
      {/* <DeleteDialog
        title={t("plans.delete")}
        description={t("plans.deleteConfirmation")}
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {
          setIsDeleteDialogOpen(open);
          if (!open) setSelectedPlan(null);
        }}
        onConfirm={() => {}}
        isLoading={isLoading}
      /> */}
    </div>
  );
};

export default PlansPage;
