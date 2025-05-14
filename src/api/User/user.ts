
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
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
export const getUsers = (limit: number, page: number) => {
    return axios.get<GetUsersResponse>(`/users?limit=${limit}&page=${page}`);
};




export interface CreateUserInput {
  id_no: string;
  username: string;
  email: string;
  first_name: string;
  second_name?: string;
  third_name?: string;
  last_name: string;
  gender: 'male' | 'female';
  password: string;
  phone_number: string;
  address: string;
}

export const createUser = (data: CreateUserInput) => {
  return axios.post('/users', data);
};



export const deleteUser = (id: string) => {
  return axios.delete(`/users/${id}`);
};


export const resetUserPassword = (id: string, newPassword: string) => {
  return axios.put(`/users/reset_user_password/${id}`, {
    newPassword,
  });
};

