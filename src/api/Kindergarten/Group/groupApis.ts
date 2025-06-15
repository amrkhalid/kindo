import axiosInstance from "@/api/axiosInstance";
import { Child } from "../Children/childrenApis";
import { Staff } from "../Group_staff/staffApis";

export interface Group {
    id: string;
    kg_id: string;
    name: string;
    children: Child[];
    staff: Staff[];   
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
  
export const getAllGroups = (limit: number, page: number, kg_id: string ) => {
    return axiosInstance.get<GroupsResponse>(`/kg/${kg_id}/group?limit=${limit}&page=${page}`);
};

export const getAllGroupsNames = (kg_id: string ) => {
    return axiosInstance.get<GroupsResponse>(`/kg/${kg_id}/group`);
};

export const createGroup = (kg_id: string ,data: CreateGroupRequest) =>
    axiosInstance.post<Group>(`/kg/${kg_id}/group`, data);

export const updateGroup = (kg_id: string ,data: CreateGroupRequest,id: string) =>
    axiosInstance.put<Group>(`/kg/${kg_id}/group/${id}`, data);
    
export const deleteGroup = (kg_id: string, id: string) =>
    axiosInstance.delete<{ message: string }>(`/kg/${kg_id}/group/${id}`);


  