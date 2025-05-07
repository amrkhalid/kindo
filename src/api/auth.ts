import axios from "./axiosInstance";


interface LoginRequest {
  username: string;
  password: string;
}

export const login = (data: LoginRequest) => axios.post("/auth/local", data);

export const getMe = () => axios.get("/users/me");

export const logout = () => axios.post("/auth/logout");
