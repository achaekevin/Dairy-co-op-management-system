import api from './api';
import type { ApiResponse, PaginatedResponse, QualityTest, QualityStandard } from '../types';

export interface CreateQualityTestData {
  date: string;
  time: string;
  sampleType: 'INCOMING_MILK' | 'PROCESSED_MILK' | 'BUTTER' | 'GHEE' | 'PANEER' | 'CURD';
  batchNumber?: string;
  farmerId?: string;
  fat: number;
  snf: number;
  protein: number;
  lactose: number;
  temperature: number;
  ph: number;
  acidity: number;
  density: number;
  alcoholTest: 'PASS' | 'FAIL';
  cob: 'PASS' | 'FAIL';
  mbrt: number;
  coliformCount: number;
  overallResult: 'PASS' | 'FAIL' | 'RETEST';
  remarks?: string;
}

export interface QualityTestFilters {
  search?: string;
  sampleType?: string;
  overallResult?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
}

export const qualityService = {
  getAll: async (filters?: QualityTestFilters): Promise<ApiResponse<PaginatedResponse<QualityTest>>> => {
    const response = await api.get('/quality-tests', { params: filters });
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<QualityTest>> => {
    const response = await api.get(`/quality-tests/${id}`);
    return response.data;
  },

  create: async (data: CreateQualityTestData): Promise<ApiResponse<QualityTest>> => {
    const response = await api.post('/quality-tests', data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateQualityTestData>): Promise<ApiResponse<QualityTest>> => {
    const response = await api.put(`/quality-tests/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await api.delete(`/quality-tests/${id}`);
    return response.data;
  },

  getStandards: async (): Promise<ApiResponse<QualityStandard[]>> => {
    const response = await api.get('/quality-tests/standards');
    return response.data;
  },

  getStats: async (): Promise<ApiResponse<{
    totalTests: number;
    passRate: number;
    failRate: number;
    retestRate: number;
  }>> => {
    const response = await api.get('/quality-tests/stats');
    return response.data;
  },
};
