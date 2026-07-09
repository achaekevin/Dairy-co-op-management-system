import api from './api';
import type { ApiResponse, PaginatedResponse, Loan } from '../types';

export interface CreateLoanData {
  farmerId: string;
  amount: number;
  interestRate: number;
  tenure: number;
  purpose: string;
}

export interface LoanFilters {
  search?: string;
  farmerId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}

export const loanService = {
  getAll: async (filters?: LoanFilters): Promise<ApiResponse<PaginatedResponse<Loan>>> => {
    const response = await api.get('/loans', { params: filters });
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<Loan>> => {
    const response = await api.get(`/loans/${id}`);
    return response.data;
  },

  create: async (data: CreateLoanData): Promise<ApiResponse<Loan>> => {
    const response = await api.post('/loans', data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateLoanData>): Promise<ApiResponse<Loan>> => {
    const response = await api.put(`/loans/${id}`, data);
    return response.data;
  },

  approve: async (id: string): Promise<ApiResponse<Loan>> => {
    const response = await api.patch(`/loans/${id}/approve`);
    return response.data;
  },

  disburse: async (id: string, disbursementDate: string): Promise<ApiResponse<Loan>> => {
    const response = await api.patch(`/loans/${id}/disburse`, { disbursementDate });
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await api.delete(`/loans/${id}`);
    return response.data;
  },

  getStats: async (): Promise<ApiResponse<{
    totalLoans: number;
    activeLoans: number;
    totalDisbursed: number;
    totalOutstanding: number;
    totalPaid: number;
  }>> => {
    const response = await api.get('/loans/stats');
    return response.data;
  },
};
