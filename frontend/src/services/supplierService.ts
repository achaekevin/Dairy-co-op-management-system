import api from './api';
import type { ApiResponse, PaginatedResponse, Supplier, PurchaseOrder } from '../types';

export interface CreateSupplierData {
  name: string;
  category: string;
  contactPerson: string;
  phoneNumber: string;
  email?: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  gstNumber?: string;
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
  creditLimit: number;
  creditDays: number;
}

export interface SupplierFilters {
  search?: string;
  category?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}

export interface CreatePurchaseOrderData {
  supplierId: string;
  orderDate: string;
  expectedDelivery: string;
  items: Array<{
    itemId: string;
    quantity: number;
    unitPrice: number;
  }>;
  notes?: string;
}

export const supplierService = {
  getAll: async (filters?: SupplierFilters): Promise<ApiResponse<PaginatedResponse<Supplier>>> => {
    const response = await api.get('/suppliers', { params: filters });
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<Supplier>> => {
    const response = await api.get(`/suppliers/${id}`);
    return response.data;
  },

  create: async (data: CreateSupplierData): Promise<ApiResponse<Supplier>> => {
    const response = await api.post('/suppliers', data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateSupplierData>): Promise<ApiResponse<Supplier>> => {
    const response = await api.put(`/suppliers/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await api.delete(`/suppliers/${id}`);
    return response.data;
  },

  getPurchaseOrders: async (supplierId?: string): Promise<ApiResponse<PaginatedResponse<PurchaseOrder>>> => {
    const response = await api.get('/purchase-orders', { params: { supplierId } });
    return response.data;
  },

  createPurchaseOrder: async (data: CreatePurchaseOrderData): Promise<ApiResponse<PurchaseOrder>> => {
    const response = await api.post('/purchase-orders', data);
    return response.data;
  },

  getStats: async (): Promise<ApiResponse<{
    totalSuppliers: number;
    activeSuppliers: number;
    totalPurchases: number;
    totalOutstanding: number;
  }>> => {
    const response = await api.get('/suppliers/stats/summary');
    return response.data;
  },
};
