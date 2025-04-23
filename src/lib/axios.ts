import axios from 'axios';
import { authService } from '@/services/auth.service';
import { API } from '@/constants/api';

const api = axios.create({
  baseURL: API.BASE_URL,
  headers: API.HEADERS,
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is a network error or the server is down
    if (!error.response) {
      return Promise.reject(new Error('Network error - please check your connection'));
    }

    // If the error is a 401 and we haven't tried to refresh the token yet
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // try {
      //   // Try to refresh the token
         
      //   // Store the new token
         
      //   // Update the original request with the new token
      //   originalRequest.headers.Authorization = `Bearer ${token}`;
        
      //   // Retry the original request
      //   return api(originalRequest);
      // } catch (refreshError) {
      //   // If refresh fails, logout and redirect to login
      //   authService.logout();
      //   window.location.href = '/login';
      //   return Promise.reject(refreshError);
      // }
    }

    // For other errors, return a user-friendly error message
    const errorMessage = error.response?.data?.message || 'An unexpected error occurred';
    return Promise.reject(new Error(errorMessage));
  }
);

export default api; 