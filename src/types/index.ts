export type Role = 'manager' | 'staff';

export interface User {
  id: string;
  username: string;
  email: string;
  identity: string;
  role: Role;
  joinDate: string;
  createdAt: string;
}

export interface Kindergarten {
  id: string;
  name: string;
  address: string;
  phoneNumber: string;
  isActive: boolean;
  planIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Child {
  id: string;
  firstName: string;
  secondName: string;
  thirdName: string;
  lastName: string;
  fatherIdNumber: string;
  motherIdNumber: string;
  birthDate: string;
  createdAt: string;
}

export interface Group {
  id: string;
  name: string;
  children: Child[];
  staffName: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  childName: string;
  parentEmail: string;
  amount: number;
  paymentMethod: string;
  paymentDate: string;
  status: 'paid' | 'pending' | 'overdue';
  createdAt: string;
}

export interface AuditLog {
  id: string;
  action: string;
  fullName: string;
  message: string;
  description: string;
  createdAt: string;
}
