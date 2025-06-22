import axiosInstance from "@/api/axiosInstance";

export interface CreateLeaveRequest {
    child_id: string;
    date: string;
    time: string;
    note: string;
}

export const createLeave = (kg_id: string, data: CreateLeaveRequest) =>
    axiosInstance.post(`/kg/${kg_id}/leave`, data);