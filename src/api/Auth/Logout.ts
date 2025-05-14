import axios from "../axiosInstance";

interface DeviceInformation {
  device_type?: string;
  device_name?: string;
  token: string;
}

interface LogoutRequest {
  platform: string;
  device_information: DeviceInformation;
}

export const logout = (data: LogoutRequest) =>
  axios.post("/auth/logout", data);
