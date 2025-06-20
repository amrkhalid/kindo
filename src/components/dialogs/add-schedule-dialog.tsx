import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Activity } from "@/api/Kindergarten/Activity/activityApis";
import { useEffect } from "react";
import { Schedule } from "@/api/Kindergarten/Schedule/scheduleApis";
import { useTranslation } from "react-i18next";


export const scheduleFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  start_time: z.string().min(1, "Start time is required"),
  end_time: z.string().min(1, "End time is required"),
  week: z.string().min(1, "Week is required"),
  activities: z
    .array(
      z.object({
        date: z.string().min(1, "Date is required"),
        activities: z.array(z.string().min(1, "Activity ID required")),
      })
    )
    .min(1, "At least one activity day is required"),
});

type ScheduleFormValues = z.infer<typeof scheduleFormSchema>;

interface ScheduleDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ScheduleFormValues) => Promise<void>;
  activities: Activity[];
}

interface ScheduleDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ScheduleFormValues) => Promise<void>;
  activities: Activity[];
  selectedSchedule?: Schedule | null;
}

export function AddScheduleDialog({
  isOpen,
  onOpenChange,
  onSubmit,
  activities,
  selectedSchedule,
}: ScheduleDialogProps) {
  const formatDateTimeForInput = (isoString: string) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toISOString().slice(0, 16);
  };
    const { t } = useTranslation();


  const scheduleFormHook = useForm<ScheduleFormValues>({
    resolver: zodResolver(scheduleFormSchema),
    defaultValues: {
      name: selectedSchedule?.name || "",
      start_time: selectedSchedule
        ? formatDateTimeForInput(selectedSchedule.start_date)
        : "",
      end_time: selectedSchedule
        ? formatDateTimeForInput(selectedSchedule.end_date)
        : "",
      week: selectedSchedule?.week.toString() || "",
      activities:
        selectedSchedule?.activities.map((day) => ({
          date: day.date,
          activities: day.activities.map((a) => a.id),
        })) || [],
    },
  });

  useEffect(() => {
    if (selectedSchedule) {
      scheduleFormHook.reset({
        name: selectedSchedule.name,
        start_time: formatDateTimeForInput(selectedSchedule.start_date),
        end_time: formatDateTimeForInput(selectedSchedule.end_date),
        week: selectedSchedule.week.toString(),
        activities: selectedSchedule.activities.map((day) => ({
          date: day.date,
          activities: day.activities.map((a) => a.id),
        })),
      });
    } else {
      scheduleFormHook.reset({
        name: "",
        start_time: "",
        end_time: "",
        week: "",
        activities: [],
      });
    }
  }, [selectedSchedule]);

  const { fields, append, remove } = useFieldArray({
    control: scheduleFormHook.control,
    name: "activities",
  });

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {selectedSchedule ? t('schedules.edit') : t('schedules.add')}
          </DialogTitle>
        </DialogHeader>
        <Form {...scheduleFormHook}>
          <form
            onSubmit={scheduleFormHook.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FormField
              control={scheduleFormHook.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("schedules.name")}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={scheduleFormHook.control}
              name="start_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("schedules.startTime")}</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={scheduleFormHook.control}
              name="end_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("schedules.endTime")}</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={scheduleFormHook.control}
              name="week"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("schedules.week")}</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="border p-4 rounded-lg space-y-3">
                  <FormField
                    control={scheduleFormHook.control}
                    name={`activities.${index}.date`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("schedules.date")}</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={scheduleFormHook.control}
                    name={`activities.${index}.activities`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("activities.title")}</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            if (!field.value?.includes(value)) {
                              field.onChange([...(field.value || []), value]);
                            }
                          }}
                          value=""
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select activities" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {activities
                              .filter(
                                (activity) =>
                                  !field.value?.includes(activity.id)
                              )
                              .map((activity) => (
                                <SelectItem
                                  key={activity.id}
                                  value={activity.id}
                                >
                                  {activity.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>

                        <div className="flex flex-wrap gap-2 mt-2">
                          {field.value?.map((activityId) => {
                            const activity = activities.find(
                              (a) => a.id === activityId
                            );
                            if (!activity) return null;
                            return (
                              <Badge
                                key={activityId}
                                className="flex items-center gap-1"
                              >
                                {activity.name}
                                <button
                                  type="button"
                                  onClick={() => {
                                    field.onChange(
                                      field.value.filter(
                                        (id) => id !== activityId
                                      )
                                    );
                                  }}
                                  className="ml-1 p-0.5 rounded-full hover:bg-accent"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </Badge>
                            );
                          })}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => remove(index)}
                  >
                    {t("schedules.removeActivity")}
                  </Button>
                </div>
              ))}

              <Button
                type="button"
                onClick={() => append({ date: "", activities: [] })}
                className="w-full"
              >
                + {t('activities.dialogTitleAdd')}
              </Button>
            </div>

            <Button
              type="submit"
              className="bg-[#1A5F5E] hover:bg-[#1A5F5E]/90 w-full"
            >
              {selectedSchedule ? t('schedules.dialogTitleEdit'): t('schedules.dialogTitleAdd')}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}