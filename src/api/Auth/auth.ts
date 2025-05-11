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

interface DeviceInformation {
  device_type?: string;
  device_name?: string;
  token: string;
}

interface LogoutRequest {
  platform: string;
  device_information: DeviceInformation;
}

export const login = (data: LoginRequest) =>
  axios.post<LoginResponse>("/auth/login/web", data);

export const getMe = () => axios.get("/users/me");

export const logout = (data: LogoutRequest) =>
  axios.post("/auth/logout", data);
