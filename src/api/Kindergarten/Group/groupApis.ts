import axiosInstance from "@/api/axiosInstance";
import { Child } from "../Children/childrenApis";

export interface Group {
    id: string;
    kg_id: string;
    name: string;
    children: Child[];
    // staff: Staff[];   
    created_at: string;
    updated_at: string;
  }
  
  export interface GroupsResponse {
    data: Group[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }
  
export interface CreateGroupRequest {
    name: string;
  }
  
export const getAllGroups = async (kg_id: string): Promise<Group[]> => {
  const response = await axiosInstance.get<GroupsResponse>(`/kg/${kg_id}/group`);
  return response.data.data;
};

export const createGroup = (kg_id: string ,data: CreateGroupRequest) =>
    axiosInstance.post<Group>(`/kg/${kg_id}/group`, data);

export const updateGroup = (kg_id: string ,data: CreateGroupRequest,id: string) =>
    axiosInstance.put<Group>(`/kg/${kg_id}/group/${id}`, data);
    
export const deleteGroup = (kg_id: string, id: string) =>
    axiosInstance.delete<{ message: string }>(`/kg/${kg_id}/group/${id}`);


  