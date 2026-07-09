import api from './api';
import type { ApiResponse, PaginatedResponse, Farmer } from '../types';

export interface CreateFarmerData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email?: string;
  dateOfBirth: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  address: string;
  village: string;
  district: string;
  pinCode: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  aadharNumber: string;
  panNumber?: string;
  photo?: string;
  cattle: number;
  totalShares?: number;
}

export interface UpdateFarmerData extends Partial<CreateFarmerData> {
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
}

export interface FarmerFilters {
  search?: string;
  status?: string;
  village?: string;
  district?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export const farmerService = {
  getAll: async (filters?: FarmerFilters): Promise<ApiResponse<Farmer[]>> => {
    const response = await api.get('/farmers', { params: filters });
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<Farmer>> => {
    const response = await api.get(`/farmers/${id}`);
    return response.data;
  },

  create: async (data: CreateFarmerData): Promise<ApiResponse<Farmer>> => {
    const response = await api.post('/farmers', data);
    return response.data;
  },

  update: async (id: string, data: UpdateFarmerData): Promise<ApiResponse<Farmer>> => {
    const response = await api.put(`/farmers/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await api.delete(`/farmers/${id}`);
    return response.data;
  },

  getStats: async (): Promise<ApiResponse<{
    totalFarmers: number;
    activeFarmers: number;
    totalCattle: number;
    totalShares: number;
    totalOutstandingLoans: number;
  }>> => {
    const response = await api.get('/farmers/stats');
    return response.data;
  },

  exportFarmers: async (filters?: FarmerFilters): Promise<Blob> => {
    const response = await api.get('/farmers/export', {
      params: filters,
      responseType: 'blob',
    });
    return response.data;
  },
};
