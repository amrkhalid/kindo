import axiosInstance from "../axiosInstance";

export interface Invoice {
  id: string;
  amount_paid: number;
  payment_date: string;
  payment_method: string;
  parent_id: string;
  child_id: string;
  kg_id: string;
  notes: string;
  canceled: boolean;
  created_at: string;
  updated_at: string;
  active: boolean;
  childuser: ChildUser;
  parentuser?: ParentUser;
}

export interface ParentUser {
  id: string;
  username: string;
  email: string;
  first_name: string;
  second_name: string;
  third_name: string;
  last_name: string;
  phone_number: string;
  address: string;
}

export interface ChildUser {
  id: string;
  first_name: string;
  second_name: string;
  third_name: string;
  last_name: string;
  birth_date: string;
  kg_id: string;
}

export interface InvoiceResponse {
  data: Invoice[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface InvoiceRequest {
  child_id: string;
  parent_id: string;
  amount_paid: number;
  payment_method: string;
  payment_date: string;
  notes: string;
}

export const getAllTransaction = (limit: number, page: number, kg_id: string ) => {
    return axiosInstance.get<InvoiceResponse>(`/finance/${kg_id}/invoice?limit=${limit}&page=${page}`);
};

export const createInvoice = (kg_id: string ,data: InvoiceRequest) =>
    axiosInstance.post<Invoice>(`/finance/${kg_id}/invoice`, data);

export const deleteInvoice = (kg_id: string, id: string) =>
    axiosInstance.delete<{ message: string }>(`/finance/${kg_id}/invoice/${id}`);


