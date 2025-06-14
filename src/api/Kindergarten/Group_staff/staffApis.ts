import axiosInstance from "@/api/axiosInstance";
import { User } from "@/api/User/user";

export interface Staff {
  id: string;
  user_id: string;
  kg_id: string;
  role: string;
  created_at: string;
  updated_at: string; 
  user: User;
}

interface StaffResponse {
  data: Staff[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface GroupStaff{
  id: string;
  group_id: string;
  staff_id: string;
  is_active: boolean;
  created_at: string; 
  updated_at: string; 
}

interface GroupStaffResponse {
  data: GroupStaff[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface CreateGroupStaffRequest {
  group_id: string;
  staff_id: string;
}

interface UpdateGroupStaffRequest {
  staff_id: string;
}

export const getAllStaff = async (kg_id: string) => {
  return axiosInstance.get<StaffResponse>(`/kg/${kg_id}/rolestaff`);
};

export const getAllGroupStaff = async (kg_id: string) => {
  return axiosInstance.get<GroupStaffResponse>(`/kg/${kg_id}/group-staff`);
};

export const createGroupStaff = (kg_id: string ,data: CreateGroupStaffRequest) =>
    axiosInstance.post<GroupStaff>(`/kg/${kg_id}/group-staff`, data);

export const updateGroupStaff = (kg_id: string ,data: UpdateGroupStaffRequest,id: string) =>
    axiosInstance.put<GroupStaff>(`/kg/${kg_id}/group-staff/${id}`, data);
    
export const deleteGroupStaff = (kg_id: string, id: string) =>
    axiosInstance.delete<{ message: string }>(`/kg/${kg_id}/group-staff/${id}`);


  