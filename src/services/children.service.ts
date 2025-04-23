import api from '@/lib/axios';
import { API } from '@/constants/api';
import { Child } from '@/types/child';

interface CreateChildDTO {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'male' | 'female';
  parentId: string;
  groupId?: string;
}

type UpdateChildDTO = Partial<CreateChildDTO>;

class ChildrenService {
  private static instance: ChildrenService;
  private baseUrl = `${API.BASE_URL}/children`;

  private constructor() {}

  public static getInstance(): ChildrenService {
    if (!ChildrenService.instance) {
      ChildrenService.instance = new ChildrenService();
    }
    return ChildrenService.instance;
  }

  async getAllChildren(): Promise<Child[]> {
    const response = await api.get<Child[]>(this.baseUrl);
    return response.data;
  }

  async getChildById(id: string): Promise<Child> {
    const response = await api.get<Child>(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async createChild(data: CreateChildDTO): Promise<Child> {
    const response = await api.post<Child>(this.baseUrl, data);
    return response.data;
  }

  async updateChild(id: string, data: UpdateChildDTO): Promise<Child> {
    const response = await api.patch<Child>(`${this.baseUrl}/${id}`, data);
    return response.data;
  }

  async deleteChild(id: string): Promise<void> {
    await api.delete(`${this.baseUrl}/${id}`);
  }

  async getChildrenByParentId(parentId: string): Promise<Child[]> {
    const response = await api.get<Child[]>(`${this.baseUrl}/parent/${parentId}`);
    return response.data;
  }

  async getChildrenByGroupId(groupId: string): Promise<Child[]> {
    const response = await api.get<Child[]>(`${this.baseUrl}/group/${groupId}`);
    return response.data;
  }
}

export const childrenService = ChildrenService.getInstance(); 