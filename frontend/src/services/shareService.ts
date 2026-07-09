import api from './api';
import type { ApiResponse, Share } from '../types';

export interface CreateShareData {
  farmerId: string;
  shareCount: number;
  shareValue: number;
  purchaseDate: string;
}

export interface ShareFilters {
  search?: string;
  farmerId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}

export const shareService = {
  getAll: async (filters?: ShareFilters): Promise<ApiResponse<Share[]>> => {
    const response = await api.get('/shares', { params: filters });
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<Share>> => {
    const response = await api.get(`/shares/${id}`);
    return response.data;
  },

  create: async (data: CreateShareData): Promise<ApiResponse<Share>> => {
    const response = await api.post('/shares', data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateShareData>): Promise<ApiResponse<Share>> => {
    const response = await api.put(`/shares/${id}`, data);
    return response.data;
  },

  transfer: async (id: string, transferredTo: string, transferDate: string): Promise<ApiResponse<Share>> => {
    const response = await api.patch(`/shares/${id}/transfer`, { transferredTo, transferDate });
    return response.data;
  },

  redeem: async (id: string, redemptionDate: string): Promise<ApiResponse<Share>> => {
    const response = await api.patch(`/shares/${id}/redeem`, { redemptionDate });
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await api.delete(`/shares/${id}`);
    return response.data;
  },

  getStats: async (): Promise<ApiResponse<{
    totalShares: number;
    activeShares: number;
    totalValue: number;
    totalShareholders: number;
  }>> => {
    const response = await api.get('/shares/stats');
    return response.data;
  },
};
