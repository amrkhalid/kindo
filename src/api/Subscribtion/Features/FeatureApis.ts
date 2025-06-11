import axiosInstance from "@/api/axiosInstance";
import axios from "axios";

export interface Feature {
  _id: string;
  name: string;
  enable: boolean;
  buildIn: boolean;
  created_at: string;
  updated_at: string;
}

export interface FeatureResponse {
  data: Feature[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
export const getFeatures = (page = 1, limit = 10) =>
  axiosInstance.get<FeatureResponse>(`/subscribtion/feature?page=${page}&limit=${limit}`);


export const updateFeature = async (id: string, enable: boolean) => {
  const token = localStorage.getItem("token"); 
  return await axios.put(
    `http://localhost:3000/api/v1/subscribtion/feature/${id}`,
    { enable },
    {
      headers: {
        Authorization: `${token}`,
          'x-api-key': token,
      },
    }
  );
};

export const addFeature = async (featureData: {
  name: string;
  enable: boolean;
  buildIn: boolean;
}) => {
  const token = localStorage.getItem("token");
  return await axios.post(
    "http://localhost:3000/api/v1/subscribtion/feature",
    { featureData },
    {
      headers: {
        Authorization: `${token}`,
        "x-api-key": token,
      },
    }
  );
};

