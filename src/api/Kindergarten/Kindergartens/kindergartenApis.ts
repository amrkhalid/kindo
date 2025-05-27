import axiosInstance from "@/api/axiosInstance";

export interface Kindergarten {
  id: string;
  name: string;
  address: string;
  phone_number: string;
  is_active: boolean;
  plan_id: string;
  created_at: string;
  updated_at: string;
  __v: number;
}

export interface Plan {
  _id: string;
  name: string;
  startDate: string;
  endDate: string;
  cost: number;
  discount: number;
  enable: boolean;
  buildIn: boolean;
  created_at: string;
  updated_at: string;
  __v: number;
}

export interface Feature {
  id: string;
  name: string;
  enable: boolean;
  buildIn: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateKindergartenRequest {
    name: string;
    address: string;
    phone_number: string;
    plan_id:string;
  }

export interface GetKgsResponse {
  data: Kindergarten[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const getAllKgs = (limit: number, page: number) => {
    return axiosInstance.get<GetKgsResponse>(`/kg?limit=${limit}&page=${page}`);
};

export const createKindergarten = (data: CreateKindergartenRequest) =>
    axiosInstance.post<Kindergarten>("/kg", data);
  

export const updateKindergarten = (id: string, data: CreateKindergartenRequest) =>
  axiosInstance.put(`/kg/${id}`, data);

export const deleteKindergarten = (id: string) =>
    axiosInstance.delete<{ message: string }>(`/kg/${id}`);
  