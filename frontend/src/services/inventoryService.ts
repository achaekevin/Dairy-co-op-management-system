import api from './api';
import type { ApiResponse, PaginatedResponse, InventoryItem, StockTransaction } from '../types';

export interface CreateInventoryItemData {
  itemName: string;
  category: 'CATTLE_FEED' | 'MEDICINE' | 'EQUIPMENT' | 'PACKAGING' | 'CLEANING' | 'OTHER';
  unit: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unitPrice: number;
  supplierName: string;
  supplierId: string;
  location: string;
  expiryDate?: string;
  batchNumber?: string;
}

export interface InventoryFilters {
  search?: string;
  category?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}

export interface CreateStockTransactionData {
  itemId: string;
  type: 'IN' | 'OUT' | 'ADJUSTMENT';
  quantity: number;
  reason: string;
  referenceNumber?: string;
  notes?: string;
}

export const inventoryService = {
  getAll: async (filters?: InventoryFilters): Promise<ApiResponse<PaginatedResponse<InventoryItem>>> => {
    const response = await api.get('/inventory', { params: filters });
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<InventoryItem>> => {
    const response = await api.get(`/inventory/${id}`);
    return response.data;
  },

  create: async (data: CreateInventoryItemData): Promise<ApiResponse<InventoryItem>> => {
    const response = await api.post('/inventory', data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateInventoryItemData>): Promise<ApiResponse<InventoryItem>> => {
    const response = await api.put(`/inventory/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await api.delete(`/inventory/${id}`);
    return response.data;
  },

  getTransactions: async (itemId?: string): Promise<ApiResponse<StockTransaction[]>> => {
    const response = await api.get('/inventory/transactions', { params: { itemId } });
    return response.data;
  },

  createTransaction: async (data: CreateStockTransactionData): Promise<ApiResponse<StockTransaction>> => {
    const response = await api.post('/inventory/transactions', data);
    return response.data;
  },

  getStats: async (): Promise<ApiResponse<{
    totalItems: number;
    lowStockItems: number;
    outOfStockItems: number;
    totalValue: number;
  }>> => {
    const response = await api.get('/inventory/stats');
    return response.data;
  },
};
