import axiosInstance from "@/api/axiosInstance";
import { User } from "@/api/User/user";

interface Kindergarten {
    id: string;
    name: string;
    address: string;
  };
  
export interface Child {
    id: string;
    first_name: string;
    second_name: string;
    third_name: string;
    last_name: string;
    birth_date: string;
    kg_id: string;
    mother_idno: string;
    father_idno: string;
    created_at: string;
    updated_at: string;
    kindergarten: Kindergarten;
    fatheruser: User;
    motheruser: User;
  };
  
interface ChildrenResponse {
    data: Child[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };


export interface CreateChildRequest {
    first_name: string;
    second_name: string;
    third_name: string;
    last_name: string;
    birth_date: string;
    father_idno: string;
    mother_idno: string;
  }
  
type GetAllChildrenParams = {
  limit?: number;
  page?: number;
  kg_id: string;
};

export const getAllChildren = ({ limit = 10, page = 1, kg_id }: GetAllChildrenParams) => {
  return axiosInstance.get<ChildrenResponse>(`/kg/${kg_id}/child?limit=${limit}&page=${page}`);
};

export const createChild = (kg_id: string ,data: CreateChildRequest) =>
    axiosInstance.post<Child>(`/kg/${kg_id}/child`, data);
    
export const updateChild = ( kg_id: string, id: string,data: CreateChildRequest & { kg: string }) =>
    axiosInstance.put<Child>(`/kg/${kg_id}/child/${id}`, data);


export const deleteChild = (kg_id: string, id: string) =>
    axiosInstance.delete<{ message: string }>(`/kg/${kg_id}/child/${id}`);


  