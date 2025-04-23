export interface Activity {
  id?: string;
  name: string;
  description: string;
  location: string;
  start_time: string;
  end_time: string;
}

export type ActivityFormData = Omit<Activity, 'id'>; 