import axios from "./axiosInstance";

interface GetUserProfileResponse {
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

export const getUserProfile = () => {
  return axios.get<GetUserProfileResponse>("/profile", {});
};
