import axios from "../axiosInstance";
import { Kindergarten, Feature, Plan } from "../Kindergarten/Kindergartens/kindergartenApis";



export interface MyKGItem {
  kindergartenId: Kindergarten;
  roleName: string;
  plan: Plan;
  features: Feature[];
}

export const getMyKG = async (): Promise<Kindergarten[]> => 
  (await axios.get<{ data: MyKGItem[] }>("/profile/my-kg")).data.data.map(item => item.kindergartenId);
