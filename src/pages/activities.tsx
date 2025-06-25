import { useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MoreVertical, Pencil, Trash2, MapPin, Clock } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Activity } from "@/types/activity";
import { format } from "date-fns";
import { PageHeader } from "@/components/ui/page-header";
import { useTranslation } from "react-i18next";
import {
  createActivity,
  deleteActivity,
  getAllActivities,
  updateActivity,
} from "@/api/Kindergarten/Activity/activityApis";
import {
  createSchedule,
  CreateScheduleRequest,
  deleteSchedule,
  getAllSchedules,
  Schedule,
  updateSchedule,
  UpdateScheduleRequest,
} from "@/api/Kindergarten/Schedule/scheduleApis";
import {
  AddScheduleDialog,
  scheduleFormSchema,
} from "@/components/dialogs/add-schedule-dialog";
import {
  ActivityDialog,
  activityFormSchema,
} from "@/components/dialogs/add-activity-dialog";
import { EditScheduleDialog } from "@/components/dialogs/edit-schedule-dialog";

export type ScheduleFormValues = z.infer<typeof scheduleFormSchema>;
type ActivityFormValues = z.infer<typeof activityFormSchema>;

export function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(
    null
  );
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [highlightedDates, setHighlightedDates] = useState<Date[]>([]);
  const Kg_id = localStorage.getItem("selectedKG");
  const { toast } = useToast();
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

  const scheduleFormHook = useForm<ScheduleFormValues>({
    resolver: zodResolver(scheduleFormSchema),
    defaultValues: {
      name: "",
      start_time: "",
      end_time: "",
      week: "",
      activities: [],
    },
  });

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await getAllActivities(Kg_id);
        setActivities(response.data);
        console.log("accc", response.data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load activities",
          variant: "destructive",
        });
      }
    };

    fetchActivities();
  }, [Kg_id]);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await getAllSchedules(Kg_id);
        const scheduleData = response.data.data;
        setSchedules(scheduleData);

        console.log("schedules", scheduleData);

        const activityDateSet = new Set<string>();

        scheduleData.forEach((schedule) => {
          schedule.activities.forEach((dayGroup) => {
            if (dayGroup.date) {
              activityDateSet.add(dayGroup.date);
            }
          });
        });

        const activityDates = Array.from(activityDateSet).map(
          (dateStr) => new Date(dateStr)
        );
        setHighlightedDates(activityDates);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load schedules",
          variant: "destructive",
        });
      }
    };

    fetchSchedules();
  }, [Kg_id]);

  const onSubmit = async (data: ActivityFormValues) => {
    try {
      if (selectedActivity) {
        await updateActivity(Kg_id, selectedActivity.id, { ...data });
        toast({
          title: "Activity Updated",
          description: "The activity has been updated successfully.",
          variant: "success",
        });
      } else {
        await createActivity(Kg_id, data);
        toast({
          title: "Activity Created",
          description: "The activity has been created successfully.",
          variant: "success",
        });
      }
      const res = await getAllActivities(Kg_id);
      setActivities(res.data);
      setIsDialogOpen(false);
      form.reset();
      setSelectedActivity(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong while saving the activity.",
        variant: "destructive",
      });
    }
  };

  const onSubmitCreateSchedule = async (data: ScheduleFormValues) => {
    if (!Kg_id) return;

    try {
      const formattedSchedule: CreateScheduleRequest = {
        name: data.name,
        start_time: new Date(data.start_time).toISOString(),
        end_time: new Date(data.end_time).toISOString(),
        week: Number(data.week),
        activities: data.activities.map((day) => ({
          date: day.date,
          activities: day.activities,
        })),
      };

      await createSchedule(Kg_id, formattedSchedule);
      toast({
        title: "Schedule Created",
        description: "The schedule has been created successfully.",
        variant: "success",
      });

      const res = await getAllSchedules(Kg_id);
      setSchedules(res.data.data);

      setIsScheduleDialogOpen(false);
      setSelectedSchedule(null);
      scheduleFormHook.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create schedule",
        variant: "destructive",
      });
    }
  };

  const onSubmitUpdateSchedule = async (data: ScheduleFormValues) => {
    if (!Kg_id || !selectedSchedule) return;

    try {
      const formattedSchedule: UpdateScheduleRequest = {
        name: data.name,
        start_date: new Date(data.start_time).toISOString(),
        end_date: new Date(data.end_time).toISOString(),
        week: Number(data.week),
        activities: data.activities.map((day) => ({
          date: day.date,
          activities: day.activities,
        })),
      };

      await updateSchedule(Kg_id, selectedSchedule.id, formattedSchedule);
      toast({
        title: "Schedule Updated",
        description: "The schedule has been updated successfully.",
        variant: "success",
      });

      const res = await getAllSchedules(Kg_id);
      setSchedules(res.data.data);

      setIsScheduleDialogOpen(false);
      setSelectedSchedule(null);
      scheduleFormHook.reset();
    } catch (error: any) {
      let errorMessage = "Failed to update schedule";
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const onSubmitSchedule = async (data: ScheduleFormValues) => {
    if (selectedSchedule) {
      await onSubmitUpdateSchedule(data);
    } else {
      await onSubmitCreateSchedule(data);
    }
  };

  const handleEdit = (activity: Activity) => {
    setSelectedActivity(activity);
    form.reset({
      ...activity,
      start_time: activity.start_time,
      end_time: activity.end_time,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (activityId: string) => {
    try {
      await deleteActivity(Kg_id, activityId);
      const res = await getAllActivities(Kg_id);
      setActivities(res.data);
      toast({
        title: "Activity Deleted",
        description: "The activity has been deleted successfully.",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete activity",
        variant: "destructive",
      });
    }
  };

  const handleDeleteSchedule = async (scheduleId: string) => {
    try {
      await deleteSchedule(Kg_id, scheduleId);
      const res = await getAllSchedules(Kg_id);
      setSchedules(res.data.data);
      toast({
        title: "Schedule Deleted",
        description: "The schedule has been deleted successfully.",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete schedule",
        variant: "destructive",
      });
    }
  };

  const handleAddActivity = () => {
    setSelectedActivity(null);
    form.reset();
    setIsDialogOpen(true);
  };

  const handleAddSchedule = () => {
    setSelectedSchedule(null);
    setIsScheduleDialogOpen(true);
    scheduleFormHook.reset();
  };

  const handleEditSchedule = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setIsScheduleDialogOpen(true);
  };

  const getActivityDates = () => {
    const dates = new Set<string>();
    schedules.forEach((schedule) => {
      schedule.activities.forEach((day) => {
        if (day.activities.length > 0) {
          dates.add(day.date);
        }
      });
    });
    return Array.from(dates).map((date) => new Date(date));
  };

  const getSchedulesForSelectedDate = () => {
    if (!selectedDate) return [];

    const current = new Date(selectedDate);
    current.setHours(0, 0, 0, 0);

    return schedules.filter((schedule) => {
      const start = new Date(schedule.start_date);
      start.setHours(0, 0, 0, 0);

      const end = new Date(schedule.end_date);
      end.setHours(0, 0, 0, 0);

      return current >= start && current <= end;
    });
  };
  const getScheduleRanges = () => {
    return schedules.map((schedule) => ({
      from: new Date(schedule.start_date),
      to: new Date(schedule.end_date),
    }));
  };

  const renderRightPanelContent = () => {
    if (!selectedDate) {
      return (
        <div className="space-y-6">
          {activities.length === 0 ? (
            <p className="text-center text-gray-500">
              No activities available.
            </p>
          ) : (
            activities.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                onEdit={handleEdit}
                onDelete={handleDelete}
                t={t}
              />
            ))
          )}
        </div>
      );
    }

    const schedulesForDate = getSchedulesForSelectedDate();
    if (schedulesForDate.length === 0) {
      return (
        <p className="text-center text-gray-500">
          No schedule on the selected date
        </p>
      );
    }

    return (
      <div className="space-y-6">
        {schedulesForDate.map((schedule) => {
          const formattedDate = format(selectedDate, "yyyy-MM-dd");
          const dayActivities =
            schedule.activities.find((day) => day.date === formattedDate)
              ?.activities || [];

          return (
            <div key={schedule.id} className="mb-8">
              <ScheduleHeader
                schedule={schedule}
                onEdit={handleEditSchedule}
                onDelete={handleDeleteSchedule}
              />
              {dayActivities.length > 0 ? (
                <div className="space-y-4">
                  {dayActivities.map((activity) => (
                    <ActivityCard
                      key={activity.id}
                      activity={activity}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      t={t}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic">
                  No activities scheduled for this date in {schedule.name}
                </p>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen p-1">
      <PageHeader
        title={t("activities.title")}
        description={t("schedules.description")}
        isRTL={true}
      >
        <div className="flex flex-wrap gap-4 mr-6">
          <Button
            onClick={handleAddActivity}
            className="bg-[#1A5F5E] hover:bg-[#1A5F5E]/90 px-4 py-2 rounded-lg shadow"
          >
            + {t("activities.add")}
          </Button>
          <Button
            onClick={handleAddSchedule}
            className="bg-[#1A5F5E] hover:bg-[#1A5F5E]/90 px-4 py-2 rounded-lg shadow"
          >
            + {t("schedules.add")}
          </Button>
        </div>
      </PageHeader>

      <div className="w-full grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8 mt-8">
        <div className="w-full">
          <Card className="p-4 sm:p-6 lg:p-8 w-full max-w-full">
            <div className="w-full overflow-x-auto sm:overflow-visible">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                modifiers={{
                  hasActivity: getActivityDates(),
                  isRange: getScheduleRanges(),
                }}
                modifiersClassNames={{
                  hasActivity: "bg-green-400 font-bold rounded-full",
                  isRange: "bg-blue-100",
                }}
                className="rounded-md border w-full p-4"
                classNames={{
                  months: "space-y-4 mx-auto",
                  month: "space-y-4",
                  caption:
                    "flex justify-center pt-1 relative items-center text-lg font-semibold",
                  caption_label: "text-xl font-semibold",
                  nav: "space-x-1 flex items-center",
                  nav_button:
                    "h-9 w-9 bg-transparent p-0 opacity-50 hover:opacity-100",
                  nav_button_previous: "absolute left-1",
                  nav_button_next: "absolute right-1",
                  table: "w-full border-collapse space-y-1",
                  head_row: "flex justify-between",
                  head_cell:
                    "text-muted-foreground rounded-md w-10 sm:w-12 font-normal text-[0.75rem] sm:text-base",
                  row: "flex w-full mt-2 justify-between",
                  cell: "text-center text-sm sm:text-base p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                  day: "h-10 w-10 sm:h-12 sm:w-12 p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground",
                  day_range_end: "day-range-end",
                  day_selected:
                    "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                  day_today: "bg-accent text-accent-foreground",
                  day_outside:
                    "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
                  day_disabled: "text-muted-foreground opacity-50",
                  day_hidden: "invisible",
                }}
              />
            </div>
          </Card>
        </div>
        <div className="w-full">
          <Card className="p-4 sm:p-6 lg:p-8">{renderRightPanelContent()}</Card>
        </div>
      </div>
      <ActivityDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        selectedActivity={selectedActivity}
        onSubmit={onSubmit}
        onClose={() => {
          setIsDialogOpen(false);
          form.reset();
          setSelectedActivity(null);
        }}
      />
      {selectedSchedule ? (
        <EditScheduleDialog
          isOpen={isScheduleDialogOpen}
          onOpenChange={setIsScheduleDialogOpen}
          onSubmit={onSubmitSchedule}
          activities={activities}
          selectedSchedule={selectedSchedule}
        />
      ) : (
        <AddScheduleDialog
          isOpen={isScheduleDialogOpen}
          onOpenChange={setIsScheduleDialogOpen}
          onSubmit={onSubmitSchedule}
          activities={activities}
        />
      )}
    </div>
  );
}

function ActivityCard({
  activity,
  onEdit,
  onDelete,
  t,
}: {
  activity: Activity;
  onEdit: (activity: Activity) => void;
  onDelete: (id: string) => void;
  t: any;
}) {
  return (
    <div className="p-5 rounded-xl border bg-white shadow-md hover:shadow-lg transition-shadow group relative">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-lg sm:text-xl text-[#1A5F5E] group-hover:underline break-words">
          {activity.name}
        </h3>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(activity)}
            className="hover:bg-[#1A5F5E]/10"
            aria-label="Edit"
          >
            <Pencil className="h-4 w-4 text-[#1A5F5E]" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(activity.id!)}
            className="hover:bg-red-100"
            aria-label="Delete"
          >
            <Trash2 className="h-4 w-4 text-red-600" />
          </Button>
        </div>
      </div>
      <p className="text-sm text-gray-600 mb-3 line-clamp-3 break-words">
        {activity.description}
      </p>
      <div className="flex flex-wrap gap-3 text-xs sm:text-sm items-center">
        <Badge className="bg-blue-100 text-blue-800 flex items-center gap-1 break-all">
          <MapPin className="h-4 w-4" />
          {activity.location}
        </Badge>
        <Badge className="bg-green-100 text-green-800 flex items-center gap-1 break-all">
          <Clock className="h-4 w-4" />
          {t("activities.startTime")}: {activity.start_time}
        </Badge>
        <Badge className="bg-yellow-100 text-yellow-800 flex items-center gap-1 break-all">
          <Clock className="h-4 w-4" />
          {t("activities.endTime")}: {activity.end_time}
        </Badge>
      </div>
    </div>
  );
}

function ScheduleHeader({
  schedule,
  onEdit,
  onDelete,
}: {
  schedule: Schedule;
  onEdit?: (schedule: Schedule) => void;
  onDelete?: (id: string) => void;
}) {
  const { t } = useTranslation();
  return (
    <div className="p-4 bg-gray-50 rounded-lg mb-4">
      <div className="flex justify-between items-start">
        <h3 className="font-bold text-base sm:text-lg md:text-xl text-[#1A5F5E] break-words">
          {schedule.name}
        </h3>
        {(onEdit || onDelete) && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-[#1A5F5E]/10"
                aria-label="Schedule actions"
              >
                <MoreVertical className="h-4 w-4 text-[#1A5F5E]" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onEdit && (
                <DropdownMenuItem
                  onClick={() => onEdit(schedule)}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Pencil className="h-4 w-4 text-[#1A5F5E]" />
                  <span>{t("common.edit")}</span>
                </DropdownMenuItem>
              )}
              {onDelete && (
                <DropdownMenuItem
                  onClick={() => onDelete(schedule.id!)}
                  className="flex items-center gap-2 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>{t("common.delete")}</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      <div className="flex flex-wrap gap-2 mt-2 text-sm">
        <Badge className="bg-blue-100 text-blue-800 break-all">
          Week {schedule.week}
        </Badge>
        <Badge className="bg-purple-100 text-purple-800 break-all">
          {format(new Date(schedule.start_date), "MMM d")} -{" "}
          {format(new Date(schedule.end_date), "MMM d, yyyy")}
        </Badge>
      </div>
    </div>
  );
}
