import axiosInstance from "@/api/axiosInstance";

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

export interface FeatureCreateRequest {
  featureData: {
    name: string;
    enable: boolean;
    buildIn: boolean;
  };
}

export interface FeatureUpdateRequest {
  enable: boolean;
}

export const createFeature = (data: FeatureCreateRequest) =>
  axiosInstance.post<Feature>("/subscribtion/feature", data);

export const updateFeature = (id: string, data: FeatureUpdateRequest) =>
  axiosInstance.put<Feature>(`/subscribtion/feature/${id}`, data);

export const getFeatures = (limit: number, page: number) =>
  axiosInstance.get<FeatureResponse>(`/subscribtion/feature?limit=${limit}&page=${page}`);
