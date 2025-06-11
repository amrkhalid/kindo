import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { Activity } from "@/api/Kindergarten/Activity/activityApis";

export const activityFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  location: z.string().min(1, "Location is required"),
  start_time: z.string(),
  end_time: z.string(),
});

type ActivityFormValues = z.infer<typeof activityFormSchema>;

interface ActivityDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedActivity: Activity | null;
  onSubmit: (data: ActivityFormValues) => Promise<void>;
  onClose: () => void;
}

export function ActivityDialog({
  isOpen,
  onOpenChange,
  selectedActivity,
  onSubmit,
  onClose,
}: ActivityDialogProps) {
  const { t } = useTranslation();
  const form = useForm<ActivityFormValues>({
    resolver: zodResolver(activityFormSchema),
    defaultValues: {
      name: "",
      description: "",
      location: "",
      start_time: "",
      end_time: "",
    },
  });

  useEffect(() => {
    if (selectedActivity) {
      form.reset({
        name: selectedActivity.name,
        description: selectedActivity.description,
        location: selectedActivity.location,
        start_time: selectedActivity.start_time,
        end_time: selectedActivity.end_time,
      });
    } else {
      form.reset({
        name: "",
        description: "",
        location: "",
        start_time: "",
        end_time: "",
      });
    }
  }, [selectedActivity, form]);

  const handleSubmit = async (data: ActivityFormValues) => {
    try {
      await onSubmit(data);
      onClose();
    } catch (error) {
      console.error("Failed to submit:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {selectedActivity
              ? t("activities.dialogTitleEdit")
              : t("activities.dialogTitleAdd")}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("activities.name")}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("activities.descriptionLabel")}</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("activities.location")}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="start_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("activities.startTime")}</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="end_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("activities.endTime")}</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                {t("common.cancel")}
              </Button>
              <Button type="submit">
                {selectedActivity ? t("common.save") : t("common.add")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}