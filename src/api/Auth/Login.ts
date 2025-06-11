import axiosInstance from "../axiosInstance";
import axios from "../axiosInstance";

interface LoginRequest {
  username: string;
  password: string;
}

interface User {
  id: string;
  id_no: string;
  username: string;
  email: string;
  first_name: string;
  second_name: string;
  third_name: string;
  last_name: string;
  gender: string;
  phone_number: string;
  address: string;
  is_active: boolean;
  is_superuser: boolean;
  created_at: string;
  updated_at: string;
}

interface LoginResponse {
  token: string;
  user: User;
}

interface UserRole {
  _id: string;
  user_id: string;
  kg_id: string;
  role: string;
  created_at: string;
  updated_at: string;
  __v: number;
};

export const getUserRole = ( user_id: string ) => {
    return axiosInstance.get<UserRole>(`/kg/role/user/${user_id}`);
};
export const login = (data: LoginRequest) =>
  axios.post<LoginResponse>("/auth/login/web", data);

