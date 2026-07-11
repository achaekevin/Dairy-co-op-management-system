import api from './api';

export const farmerPortalService = {
  getDashboardStats: async () => {
    const response = await api.get('/farmer-portal/dashboard');
    return response.data;
  },

  getDeliveryHistory: async (params?: { page?: number; limit?: number; shift?: string; status?: string }) => {
    const response = await api.get('/farmer-portal/deliveries', { params });
    return response.data;
  },

  getMilkStatement: async (period?: string) => {
    const response = await api.get('/farmer-portal/milk-statement', { params: { period } });
    return response.data;
  },

  getCollectionReceipt: async (collectionId: string) => {
    const response = await api.get(`/farmer-portal/receipts/${collectionId}`);
    return response.data;
  },

  getPaymentHistory: async (params?: { page?: number; limit?: number }) => {
    const response = await api.get('/farmer-portal/payments', { params });
    return response.data;
  },

  applyForLoan: async (data: {
    amount: number;
    purpose: string;
    tenure: number;
    guarantor1?: { name: string; phoneNumber: string; relationship: string };
    guarantor2?: { name: string; phoneNumber: string; relationship: string };
  }) => {
    const response = await api.post('/farmer-portal/loans/apply', data);
    return response.data;
  },

  getLoanStatus: async (params?: { page?: number; limit?: number }) => {
    const response = await api.get('/farmer-portal/loans', { params });
    return response.data;
  },

  getRepaymentSchedule: async (loanId: string) => {
    const response = await api.get(`/farmer-portal/loans/${loanId}/repayment-schedule`);
    return response.data;
  },

  getSharesOwned: async (params?: { page?: number; limit?: number }) => {
    const response = await api.get('/farmer-portal/shares', { params });
    return response.data;
  },

  getAnimalRecords: async () => {
    const response = await api.get('/farmer-portal/animals');
    return response.data;
  },

  updateProfile: async (data: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email?: string;
    dateOfBirth?: string;
    gender?: string;
    address?: string;
    village?: string;
    district?: string;
    cattle?: number;
  }) => {
    const response = await api.patch('/farmer-portal/profile', data);
    return response.data;
  },

  updateBankDetails: async (data: {
    bankDetails?: {
      bankName: string;
      accountNumber: string;
      ifscCode: string;
    };
    mobileMoneyDetails?: {
      provider: string;
      phoneNumber: string;
      accountName: string;
    };
  }) => {
    const response = await api.patch('/farmer-portal/bank-details', data);
    return response.data;
  },

  getNotifications: async () => {
    const response = await api.get('/farmer-portal/notifications');
    return response.data;
  },

  markNotificationAsRead: async (notificationId: string) => {
    const response = await api.patch(`/farmer-portal/notifications/${notificationId}/read`);
    return response.data;
  },

  markAllNotificationsAsRead: async () => {
    const response = await api.patch('/farmer-portal/notifications/read-all');
    return response.data;
  },
};

export default farmerPortalService;
