
import axios from '../axiosInstance';

export interface User {
  id: string;
  id_no: string;
  username: string;
  email: string;
  first_name?: string;
  second_name?: string;
  third_name?: string;
  last_name?: string;
  phone_number?: string;
  address?: string;
  is_active: boolean;
  is_superuser: boolean;
  created_at: string;
  updated_at: string;
}

interface GetUsersResponse {
  data: User[];
}

export const getUsers = (limit: number, page: number) => {
    return axios.get<GetUsersResponse>(`/users?limit=${limit}&page=${page}`);
  };