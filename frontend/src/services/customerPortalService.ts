import api from './api';
import type { ApiResponse } from '../types';

export interface Product {
  id: string;
  productCode: string;
  productName: string;
  category: string;
  description?: string;
  unitPrice: number;
  unit: string;
  availableStock: number;
  imageUrl?: string;
  status: 'AVAILABLE' | 'OUT_OF_STOCK' | 'DISCONTINUED';
}

export interface ProductCategory {
  category: string;
  productCount: number;
  description?: string;
}

export interface PlaceOrderRequest {
  items: {
    productId: string;
    quantity: number;
    unitPrice: number;
  }[];
  deliveryAddress: string;
  deliveryDate?: string;
  paymentMethod: 'CASH' | 'BANK_TRANSFER' | 'MOBILE_MONEY' | 'CREDIT';
  notes?: string;
}

export interface CustomerOrder {
  id: string;
  orderNumber: string;
  orderDate: string;
  totalAmount: number;
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  paymentStatus: 'UNPAID' | 'PARTIAL' | 'PAID';
  deliveryDate?: string;
  items: {
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
}

export interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  totalSpending: number;
  loyaltyPoints: number;
}

export const customerPortalService = {
  getDashboard: async (): Promise<ApiResponse<DashboardStats>> => {
    const response = await api.get('/customer-portal/dashboard');
    return response.data;
  },

  getProducts: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
  }): Promise<ApiResponse<Product[]>> => {
    const response = await api.get('/customer-portal/products', { params });
    return response.data;
  },

  getProductCategories: async (): Promise<ApiResponse<ProductCategory[]>> => {
    const response = await api.get('/customer-portal/products/categories');
    return response.data;
  },

  placeOrder: async (data: PlaceOrderRequest): Promise<ApiResponse<CustomerOrder>> => {
    const response = await api.post('/customer-portal/orders', data);
    return response.data;
  },

  getOrderHistory: async (params?: {
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<CustomerOrder[]>> => {
    const response = await api.get('/customer-portal/orders', { params });
    return response.data;
  },

  trackOrder: async (orderNumber: string): Promise<ApiResponse<any>> => {
    const response = await api.get(`/customer-portal/orders/${orderNumber}/track`);
    return response.data;
  },
};
