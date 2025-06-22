import axiosInstance from "@/api/axiosInstance";

export interface CreateAbsenceRequest {
  child_id: string;
  absence: string;
  date: string;
  time: string;
  note: string;
}

export const createAbsence = (kg_id: string, data: CreateAbsenceRequest) =>
  axiosInstance.post(`/kg/${kg_id}/absence`, data);