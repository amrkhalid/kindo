import axios from "../axiosInstance";

interface ResetRequest {
  oldPassword: string;
  newPassword: string;
}

export const resetPassword = (data: ResetRequest) =>
    axios.patch('/profile/reset-password',data );
  
