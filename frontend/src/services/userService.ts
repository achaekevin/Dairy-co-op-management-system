import api from './api';
import type { ApiResponse, User } from '../types';

export interface UserFilters {
  search?: string;
  role?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export const userService = {
  getAll: async (filters?: UserFilters): Promise<ApiResponse<User[]>> => {
    const response = await api.get('/users', { params: filters });
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
};
