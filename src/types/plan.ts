export interface Plan {
  id?: string;
  name: string;
  startDate: string;
  endDate: string;
  cost: number;
  discount: number;
  enable: boolean;
  buildIn: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PlanRequest {
  planData: Omit<Plan, 'id' | 'createdAt' | 'updatedAt'>;
  features: string[];
} 