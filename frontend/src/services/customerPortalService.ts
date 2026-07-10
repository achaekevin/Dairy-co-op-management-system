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

  cancelOrder: async (orderId: string): Promise<ApiResponse<any>> => {
    const response = await api.post(`/customer-portal/orders/${orderId}/cancel`);
    return response.data;
  },

  getInvoice: async (orderId: string): Promise<ApiResponse<any>> => {
    const response = await api.get(`/customer-portal/invoices/${orderId}`);
    return response.data;
  },

  getPaymentHistory: async (params?: {
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<any[]>> => {
    const response = await api.get('/customer-portal/payments', { params });
    return response.data;
  },

  makePayment: async (data: {
    orderId: string;
    amount: number;
    paymentMethod: 'CASH' | 'BANK_TRANSFER' | 'MOBILE_MONEY' | 'CHEQUE';
    transactionId?: string;
  }): Promise<ApiResponse<any>> => {
    const response = await api.post('/customer-portal/payments', data);
    return response.data;
  },

  getProfile: async (): Promise<ApiResponse<any>> => {
    const response = await api.get('/customer-portal/profile');
    return response.data;
  },

  updateProfile: async (data: any): Promise<ApiResponse<any>> => {
    const response = await api.put('/customer-portal/profile', data);
    return response.data;
  },

  getDeliveryAddresses: async (): Promise<ApiResponse<any[]>> => {
    const response = await api.get('/customer-portal/delivery-addresses');
    return response.data;
  },

  saveDeliveryAddress: async (data: any): Promise<ApiResponse<any>> => {
    const response = await api.post('/customer-portal/delivery-addresses', data);
    return response.data;
  },

  getSavedPaymentMethods: async (): Promise<ApiResponse<any[]>> => {
    const response = await api.get('/customer-portal/payment-methods');
    return response.data;
  },

  savePaymentMethod: async (data: any): Promise<ApiResponse<any>> => {
    const response = await api.post('/customer-portal/payment-methods', data);
    return response.data;
  },
};
