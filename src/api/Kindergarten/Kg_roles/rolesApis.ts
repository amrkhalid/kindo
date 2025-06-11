import axiosInstance from "@/api/axiosInstance";
import { User } from "@/api/User/user";

  export interface Role {
    id: string;
    user_id: string;
    kg_id: string;
    role: string;
    created_at: string;
    updated_at: string;
    user: User;
  }
  
  export interface KgRolesResponse {
    data: Role[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }
  
  
export interface CreateRoleRequest {
    idno: string;
    role:string;
  }

export interface UpdateRoleRequest {
    role:string;
}  

export const getAllRoles = async (limit: number, page: number, kg_id: string) => {
  return axiosInstance.get<KgRolesResponse>(`/kg/${kg_id}/role?limit=${limit}&page=${page}`);
};

export const createRole = (kg_id: string ,data: CreateRoleRequest) =>
    axiosInstance.post<Role>(`/kg/${kg_id}/role`, data);

export const updateRole = (kg_id: string ,data: UpdateRoleRequest,id: string) =>
    axiosInstance.put<Role>(`/kg/${kg_id}/role/${id}`, data);
    
export const deleteRole = (kg_id: string, id: string) =>
    axiosInstance.delete<{ message: string }>(`/kg/${kg_id}/role/${id}`);


  