import axiosInstance from "@/api/axiosInstance";

export interface User {
    username: string;
    email: string;
    phone_number?: string; 
    address?: string;    
    is_active: boolean;
    is_superuser: boolean;
    created_at: string;
    updated_at: string;
  }
  
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
  
export const getAllRoles = async (kg_id: string): Promise<Role[]> => {
  const response = await axiosInstance.get<KgRolesResponse>(`/kg/${kg_id}/role`);
  return response.data.data;
};

export const createRole = (kg_id: string ,data: CreateRoleRequest) =>
    axiosInstance.post<Role>(`/kg/${kg_id}/role`, data);

export const updateRole = (kg_id: string ,data: UpdateRoleRequest,id: string) =>
    axiosInstance.put<Role>(`/kg/${kg_id}/role/${id}`, data);
    
export const deleteRole = (kg_id: string, id: string) =>
    axiosInstance.delete<{ message: string }>(`/kg/${kg_id}/role/${id}`);


  