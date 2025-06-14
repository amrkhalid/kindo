import axiosInstance from "@/api/axiosInstance";


export interface GroupChildResponse {
  data: GroupChild[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
export interface GroupChild {
  id: string;
  group_id: string;
  child_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface CreateGroupChildrenRequest {
  group_id: string;
  child_id: string;
}

interface UpdateGroupChildrenRequest {
  staff_id: string;
}


export const getAllGroupChildren = async (kg_id: string) => {
  return axiosInstance.get<GroupChildResponse>(`/kg/${kg_id}/group-children`);
};

export const createGroupChildren = (kg_id: string ,data: CreateGroupChildrenRequest) =>
    axiosInstance.post<GroupChild>(`/kg/${kg_id}/group-children`, data);

export const updateGroupChildren = (kg_id: string ,data: UpdateGroupChildrenRequest,id: string) =>
    axiosInstance.put<GroupChild>(`/kg/${kg_id}/group-children/${id}`, data);
    
export const deleteGroupChildren = (kg_id: string, id: string) =>
    axiosInstance.delete<{ message: string }>(`/kg/${kg_id}/group-children/${id}`);


  