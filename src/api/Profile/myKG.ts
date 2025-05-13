import axios from "../axiosInstance";

export interface Kindergarten {
  _id: string;
  name: string;
  address: string;
  phone_number: string;
  is_active: boolean;
  plan_id: string;
  created_at: string;
  updated_at: string;
  __v: number;
}

export interface Plan {
  _id: string;
  name: string;
  startDate: string;
  endDate: string;
  cost: number;
  discount: number;
  enable: boolean;
  buildIn: boolean;
  created_at: string;
  updated_at: string;
  __v: number;
}

interface Feature {
  id: string;
  name: string;
  enable: boolean;
  buildIn: boolean;
  created_at: string;
  updated_at: string;
}

export interface MyKGItem {
  kindergartenId: Kindergarten;
  roleName: string;
  plan: Plan;
  features: Feature[];
}

export const getMyKG = async (): Promise<Kindergarten[]> => 
  (await axios.get<{ data: MyKGItem[] }>("/profile/my-kg")).data.data.map(item => item.kindergartenId);
