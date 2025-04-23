import { Child } from './child';

export interface Group {
  id: string;
  name: string;
  description: string;
  capacity: number;
  staffName: string;
  createdAt: string;
  updatedAt: string;
  children: Child[];
} 