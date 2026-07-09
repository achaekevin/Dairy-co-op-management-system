import api from './api';
import type { ApiResponse, PaginatedResponse, Customer, Sale } from '../types';

export interface CreateCustomerData {
  customerName: string;
  businessName?: string;
  customerType: 'RETAIL' | 'WHOLESALE' | 'DISTRIBUTOR' | 'INSTITUTION';
  phoneNumber: string;
  email?: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  gstNumber?: string;
  creditLimit: number;
  creditDays: number;
}

export interface CustomerFilters {
  search?: string;
  customerType?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}

export const customerService = {
  getAll: async (filters?: CustomerFilters): Promise<ApiResponse<PaginatedResponse<Customer>>> => {
    const response = await api.get('/customers', { params: filters });
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<Customer>> => {
    const response = await api.get(`/customers/${id}`);
    return response.data;
  },

  create: async (data: CreateCustomerData): Promise<ApiResponse<Customer>> => {
    const response = await api.post('/customers', data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateCustomerData>): Promise<ApiResponse<Customer>> => {
    const response = await api.put(`/customers/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await api.delete(`/customers/${id}`);
    return response.data;
  },

  getSales: async (customerId: string): Promise<ApiResponse<Sale[]>> => {
    const response = await api.get(`/customers/${customerId}/sales`);
    return response.data;
  },

  getStats: async (): Promise<ApiResponse<{
    totalCustomers: number;
    activeCustomers: number;
    totalSales: number;
    totalOutstanding: number;
  }>> => {
    const response = await api.get('/customers/stats');
    return response.data;
  },
};
