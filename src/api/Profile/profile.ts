import axios from "../axiosInstance";
import { User } from "../User/user";

export const getUserProfile = () => {
  return axios.get<User>("/profile", {});
};

export const updateUserProfile = (data: Partial<User>) => {
    return axios.put<User>("/profile/update-profile", data);
  };
  