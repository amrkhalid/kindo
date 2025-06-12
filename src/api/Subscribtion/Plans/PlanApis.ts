import axiosInstance from "@/api/axiosInstance";

export const DEFAULT_FEATURES = [
 "67f954f565d12a811dcc15b5",
  "67f954f565d12a811dcc15b9",
  "67f954f565d12a811dcc15bc",
  "67f954f565d12a811dcc15bf",
  "67f954f565d12a811dcc15c2",
  "67f954f665d12a811dcc15c5",
  "67f954f665d12a811dcc15c8"
] as const; 

export interface Feature {
  id: string;
  name: string;
  enable: boolean;
  buildIn: boolean;
}

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

export interface PlanRequest {
  planData: {
    name: string;
    startDate: string; 
    endDate: string;  
    cost: number;
    discount: number;
    enable: boolean;
    buildIn: boolean;
  };
  features: typeof DEFAULT_FEATURES;
}

export interface PlanUpdateRequest {
  updateData: { 
    name?: string;
    startDate?: string; 
    endDate?: string;  
    cost?: number;
    discount?: number;
    enable?: boolean;
    buildIn?: boolean;
  };
}

export const createPlan = (data: PlanRequest) =>
    axiosInstance.post<Plan>("/subscribtion/plan", data);

export const updatePlan = (id: string, data: PlanUpdateRequest) =>
    axiosInstance.put<Plan>(`/subscribtion/plan/${id}`, data);

export const deletePlan = (id: string) =>
    axiosInstance.delete<{ message: string }>(`/subscribtion/plan/${id}`);
 
export const getPlans = () =>
    axiosInstance.get<Plan[]>(`/subscribtion/plan`);

export const getActivePlans = () =>
    axiosInstance.get<Plan[]>("/subscribtion/plan/active");