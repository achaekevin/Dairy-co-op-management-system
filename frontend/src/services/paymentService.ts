import api from './api';
import type { ApiResponse, PaginatedResponse, Payment } from '../types';

export interface CreatePaymentData {
  farmerId: string;
  period: string;
  totalQuantity: number;
  totalAmount: number;
  bonusAmount?: number;
  deductionAmount?: number;
  netAmount: number;
  paymentMode?: 'BANK_TRANSFER' | 'CASH' | 'CHEQUE';
  transactionId?: string;
}

export interface PaymentFilters {
  search?: string;
  farmerId?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
}

export const paymentService = {
  getAll: async (filters?: PaymentFilters): Promise<ApiResponse<PaginatedResponse<Payment>>> => {
    const response = await api.get('/payments', { params: filters });
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<Payment>> => {
    const response = await api.get(`/payments/${id}`);
    return response.data;
  },

  create: async (data: CreatePaymentData): Promise<ApiResponse<Payment>> => {
    const response = await api.post('/payments', data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreatePaymentData>): Promise<ApiResponse<Payment>> => {
    const response = await api.put(`/payments/${id}`, data);
    return response.data;
  },

  approve: async (id: string): Promise<ApiResponse<Payment>> => {
    const response = await api.patch(`/payments/${id}/approve`);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await api.delete(`/payments/${id}`);
    return response.data;
  },

  getStats: async (): Promise<ApiResponse<{
    totalPayments: number;
    pendingPayments: number;
    approvedPayments: number;
    totalAmount: number;
    paidAmount: number;
  }>> => {
    const response = await api.get('/payments/stats');
    return response.data;
  },
};
