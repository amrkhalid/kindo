import axiosInstance from "@/api/axiosInstance";

export interface Activity {
  id: string;
  name: string;
  description: string;
  location: string;
  start_time: string; 
  end_time: string;   
  created_at: string; 
  updated_at: string; 
}

export interface ActivityRequest {
  name?: string;
  description?: string;
  location?: string;
  start_time?: string; 
  end_time?: string;   
}


export const getAllActivities = (kg_id: string) =>
  axiosInstance.get<Activity[]>(`/kg/${kg_id}/activity`);


export const createActivity = (kg_id: string ,data: ActivityRequest) =>
    axiosInstance.post<Activity>(`/kg/${kg_id}/activity`, data);

export const updateActivity = (kg_id: string , id: string, data: ActivityRequest) =>
    axiosInstance.put<Activity>(`/kg/${kg_id}/activity/${id}`, data);

export const deleteActivity = (kg_id: string, id: string) =>
    axiosInstance.delete<{ message: string }>(`/kg/${kg_id}/activity/${id}`);

