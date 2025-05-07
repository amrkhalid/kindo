import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, MapPin, Clock } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Activity } from '@/types/activity';
import { format } from 'date-fns';
import { PageHeader } from '@/components/ui/page-header';
import { useTranslation } from 'react-i18next';

const activityFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  location: z.string().min(1, 'Location is required'),
  start_time: z.string(),
  end_time: z.string(),
});

type ActivityFormValues = z.infer<typeof activityFormSchema>;

export function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: '1',
      name: 'Morning Circle Time',
      description: 'Daily morning gathering for songs, stories, and calendar activities',
      location: 'Main Classroom',
      start_time: '2024-03-20T08:30:00.000Z',
      end_time: '2024-03-20T09:00:00.000Z'
    },
    {
      id: '2',
      name: 'Art & Craft Session',
      description: 'Creative art session focusing on spring themes and nature crafts',
      location: 'Art Room',
      start_time: '2024-03-20T09:30:00.000Z',
      end_time: '2024-03-20T10:30:00.000Z'
    },
    {
      id: '3',
      name: 'Outdoor Play Time',
      description: 'Supervised playground activities and games',
      location: 'Playground',
      start_time: '2024-03-20T10:45:00.000Z',
      end_time: '2024-03-20T11:45:00.000Z'
    },
    {
      id: '4',
      name: 'Lunch & Story Time',
      description: 'Healthy lunch followed by interactive storytelling session',
      location: 'Dining Hall',
      start_time: '2024-03-20T12:00:00.000Z',
      end_time: '2024-03-20T13:00:00.000Z'
    },
    {
      id: '5',
      name: 'Music & Movement',
      description: 'Interactive music session with dancing and musical instruments',
      location: 'Music Room',
      start_time: '2024-03-20T14:00:00.000Z',
      end_time: '2024-03-20T15:00:00.000Z'
    }
  ]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();

  const form = useForm<ActivityFormValues>({
    resolver: zodResolver(activityFormSchema),
    defaultValues: {
      name: '',
      description: '',
      location: '',
      start_time: '',
      end_time: '',
    },
  });

  const onSubmit = (data: ActivityFormValues) => {
    if (selectedActivity) {
      // Edit existing activity
      const updatedActivities = activities.map((activity) =>
        activity.id === selectedActivity.id ? { ...activity, ...data } : activity
      );
      setActivities(updatedActivities);
      toast({
        title: 'Activity Updated',
        description: 'The activity has been updated successfully.',
      });
    } else {
      // Add new activity
      const newActivity = {
        id: Math.random().toString(36).substr(2, 9),
        name: data.name,
        description: data.description,
        location: data.location,
        start_time: data.start_time,
        end_time: data.end_time,
      };
      setActivities([...activities, newActivity]);
      toast({
        title: 'Activity Created',
        description: 'The activity has been created successfully.',
      });
    }
    setIsDialogOpen(false);
    form.reset();
    setSelectedActivity(null);
  };

  const handleEdit = (activity: Activity) => {
    setSelectedActivity(activity);
    form.reset(activity);
    setIsDialogOpen(true);
  };

  const handleDelete = (activityId: string) => {
    setActivities(activities.filter((activity) => activity.id !== activityId));
    toast({
      title: 'Activity Deleted',
      description: 'The activity has been deleted successfully.',
    });
  };

  const handleAddActivity = () => {
    setSelectedActivity(null);
    form.reset();
    setIsDialogOpen(true);
  };

  return (
    <div className="w-full min-h-screen py-8 px-0">
      <PageHeader
        title={t('activities.title')}
        description={t('activities.description')}
        isRTL={true}
      >
        <Button
          onClick={handleAddActivity}
          className="bg-[#1A5F5E] hover:bg-[#1A5F5E]/90 px-6 py-2 rounded-lg shadow self-start md:self-center"
        >
          + {t('activities.add')}
        </Button>
      </PageHeader>

      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 px-4 md:px-8 mt-10">
        <div className="w-full">
          <Card className="p-4 md:p-6">
            <Calendar
              mode="single"
              selected={new Date()}
              className="rounded-md border w-full p-4"
              classNames={{
                months: "space-y-4 mx-auto",
                month: "space-y-4",
                caption: "flex justify-center pt-1 relative items-center text-lg font-semibold",
                caption_label: "text-xl font-semibold",
                nav: "space-x-1 flex items-center",
                nav_button: "h-9 w-9 bg-transparent p-0 opacity-50 hover:opacity-100",
                nav_button_previous: "absolute left-1",
                nav_button_next: "absolute right-1",
                table: "w-full border-collapse space-y-1",
                head_row: "flex justify-between",
                head_cell: "text-muted-foreground rounded-md w-12 font-normal text-base",
                row: "flex w-full mt-2 justify-between",
                cell: "text-center text-base p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                day: "h-12 w-12 p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground",
                day_range_end: "day-range-end",
                day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                day_today: "bg-accent text-accent-foreground",
                day_outside: "day-outside text-muted-foreground opacity-50",
                day_disabled: "text-muted-foreground opacity-50",
                day_hidden: "invisible",
              }}
            />
          </Card>
        </div>

        <div className="w-full">
          <Card className="p-4 md:p-6">
            <div className="space-y-6">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="p-5 rounded-xl border bg-white shadow-md hover:shadow-lg transition-shadow group relative"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-xl text-[#1A5F5E] group-hover:underline">{activity.name}</h3>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(activity)}
                        className="hover:bg-[#1A5F5E]/10"
                        aria-label="Edit"
                      >
                        <Pencil className="h-4 w-4 text-[#1A5F5E]" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(activity.id!)}
                        className="hover:bg-red-100"
                        aria-label="Delete"
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{activity.description}</p>
                  <div className="flex flex-wrap gap-3 text-sm items-center">
                    <Badge className="bg-blue-100 text-blue-800 flex items-center gap-1"><MapPin className="h-4 w-4" /> {activity.location}</Badge>
                    <Badge className="bg-green-100 text-green-800 flex items-center gap-1"><Clock className="h-4 w-4" /> {t('activities.startTime')}: {format(new Date(activity.start_time), 'PPp')}</Badge>
                    <Badge className="bg-yellow-100 text-yellow-800 flex items-center gap-1"><Clock className="h-4 w-4" /> {t('activities.endTime')}: {format(new Date(activity.end_time), 'PPp')}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedActivity ? t('activities.dialogTitleEdit') : t('activities.dialogTitleAdd')}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('activities.name')}</FormLabel>
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
                    <FormLabel>{t('activities.descriptionLabel')}</FormLabel>
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
                    <FormLabel>{t('activities.location')}</FormLabel>
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
                    <FormLabel>{t('activities.startTime')}</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
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
                    <FormLabel>{t('activities.endTime')}</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  {t('common.cancel')}
                </Button>
                <Button type="submit">
                  {selectedActivity ? t('common.save') : t('common.add')}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
} 