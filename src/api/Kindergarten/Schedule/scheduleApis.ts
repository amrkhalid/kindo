import axiosInstance from "@/api/axiosInstance";

export interface Activity {
  id: string;
  name: string;
  description: string;
  start_time: string;
  end_time: string;  
}

export interface Activities {
  date: string; 
  activities: Activity[];
}

export interface Schedule {
  id: string;
  name: string;
  start_date: string; 
  end_date: string; 
  week: number;
  kg_id: string;
  activities: Activities[];
  created_at: string;
  updated_at: string;
}

export interface ScheduleResponse {
  data: Schedule[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateScheduleActivity {
  date: string; 
  activities: string[]; 
}

export interface CreateScheduleRequest {
  name?: string;
  start_time: string;
  end_time: string;  
  week?: number;
  activities: CreateScheduleActivity[];
}

export const getAllSchedules = ( kg_id: string) => {
    return axiosInstance.get<ScheduleResponse>(`/kg/${kg_id}/schedule`);
};

export const createSchedule = (kg_id: string ,data: CreateScheduleRequest) =>
    axiosInstance.post<Schedule>(`/kg/${kg_id}/schedule`, data);

export const updateSchedule = (kg_id: string ,data: CreateScheduleRequest,id: string) =>
    axiosInstance.put<Schedule>(`/kg/${kg_id}/schedule/${id}`, data);
    
export const deleteSchedule = (kg_id: string, id: string) =>
    axiosInstance.delete<{ message: string }>(`/kg/${kg_id}/schedule/${id}`);
