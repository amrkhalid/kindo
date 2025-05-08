import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
    'X-API-KEY': '1234567890',
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization =token;
    config.headers['X-API-KEY'] = token;
  }
  return config;
});

export default axiosInstance;
