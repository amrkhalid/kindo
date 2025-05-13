import axiosInstance from "@/api/axiosInstance";
import { Kindergarten } from "@/api/Profile/myKG";

export interface CreateKindergartenRequest {
    name: string;
    address: string;
    phone_number: string;
    plan_id:string;
  }
  

export const createKindergarten = (data: CreateKindergartenRequest) =>
    axiosInstance.post<Kindergarten>("/kg", data);
  

export const updateKindergarten = (id: string, data: CreateKindergartenRequest) =>
  axiosInstance.put<{ message: string; result: Kindergarten }>(`/kg/${id}`, data);

export const deleteKindergarten = (id: string) =>
    axiosInstance.delete<{ message: string }>(`/kg/${id}`);
  