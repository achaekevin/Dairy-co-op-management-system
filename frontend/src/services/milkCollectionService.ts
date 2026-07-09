import api from './api';
import type { ApiResponse, PaginatedResponse, MilkCollection } from '../types';

export interface CreateMilkCollectionData {
  farmerId: string;
  date: string;
  shift: 'MORNING' | 'EVENING';
  quantity: number;
  fat: number;
  snf: number;
  temperature: number;
  quality: 'EXCELLENT' | 'GOOD' | 'AVERAGE' | 'POOR';
  status: 'ACCEPTED' | 'REJECTED';
  reason?: string;
  centerId?: string;
}

export interface UpdateMilkCollectionData extends Partial<CreateMilkCollectionData> {}

export interface MilkCollectionFilters {
  search?: string;
  farmerId?: string;
  shift?: string;
  quality?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export const milkCollectionService = {
  getAll: async (filters?: MilkCollectionFilters): Promise<ApiResponse<MilkCollection[]>> => {
    const response = await api.get('/milk-collections', { params: filters });
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<MilkCollection>> => {
    const response = await api.get(`/milk-collections/${id}`);
    return response.data;
  },

  create: async (data: CreateMilkCollectionData): Promise<ApiResponse<MilkCollection>> => {
    const response = await api.post('/milk-collections', data);
    return response.data;
  },

  update: async (id: string, data: UpdateMilkCollectionData): Promise<ApiResponse<MilkCollection>> => {
    const response = await api.put(`/milk-collections/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await api.delete(`/milk-collections/${id}`);
    return response.data;
  },

  getStats: async (): Promise<ApiResponse<{
    totalCollections: number;
    todayCollections: number;
    totalQuantity: number;
    todayQuantity: number;
    averageQuality: number;
    rejectionRate: number;
  }>> => {
    const response = await api.get('/milk-collections/stats');
    return response.data;
  },
};
