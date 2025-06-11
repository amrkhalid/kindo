import axiosInstance from "@/api/axiosInstance";

export interface User {
  id: string;
  username: string;
  email: string;
  first_name: string;
  second_name: string;
  third_name: string;
  last_name: string;
  phone_number: string;
  address: string;
  is_active: boolean;
  is_superuser: boolean;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionAuditLogItem {
  id: string;
  user_id: string;
  action: string;
  message: string;
  description: string;
  created_at: string;
  user: User;
}

export interface SubscriptionAuditLogResponse {
  data: SubscriptionAuditLogItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}


export const getAuditLogs = () => 
  axiosInstance.get<SubscriptionAuditLogResponse>("/subscribtion/subscribtion-audit-log");
