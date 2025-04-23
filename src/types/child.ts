export interface Child {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'male' | 'female';
  parentId: string;
  groupId?: string;
  createdAt: string;
  updatedAt: string;
} 