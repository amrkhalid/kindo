import axiosInstance from "@/api/axiosInstance";
import { Feature } from "@/types/feature";
import axios from "axios";

export interface Plan {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  cost: number;
  discount: number;
  enable: boolean;
  buildIn: boolean;
  features: Feature[];
}

interface PlansResponse {
  data: Plan[];
  totalPages: number;
}


export const getPlans = (page = 1, limit = 10) =>
  axiosInstance.get<PlansResponse>(`/subscribtion/plan?page=${page}&limit=${limit}`);

export async function updatePlan(id: string, data: any) {
  return axiosInstance.put(`/subscribtion/plan/${id}`, data);
}

